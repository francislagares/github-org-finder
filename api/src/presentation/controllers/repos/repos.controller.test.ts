import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DeleteRepoUseCase,
  FetchReposUseCase,
  Repo,
  RepoDto,
  RepoRepository,
  SaveRepoUseCase,
} from '@/domain';
import { Branch } from '@/domain/types/branches';

import ReposController from './repos.controller';

describe('ReposController', () => {
  let mockFetchReposUseCase: FetchReposUseCase;
  let mockSaveRepoUseCase: SaveRepoUseCase;
  let mockDeleteRepoUseCase: DeleteRepoUseCase;
  let controller: ReposController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Mock use case implementations
    mockFetchReposUseCase = {
      repoRepository: vi.fn(),
      execute: vi.fn(),
    };

    mockSaveRepoUseCase = {
      execute: vi.fn(),
    };

    mockDeleteRepoUseCase = {
      execute: vi.fn(),
    };

    // Controller instance
    controller = new ReposController(
      mockFetchReposUseCase,
      mockSaveRepoUseCase,
      mockDeleteRepoUseCase,
    );

    // Mock request and response
    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  describe('getReposByOrgName', () => {
    it('should fetch repos successfully', async () => {
      // Arrange
      const orgName = 'testOrg';
      const page = '1';
      const limit = '10';
      const mockBranches: Branch[] = [
        {
          name: 'main',
          commit: {
            sha: 'abc123',
            url: 'https://api.github.com/repos/testOrg/repo1/commits/abc123',
          },
          protected: false,
        },
      ];
      const mockRepos = [
        new Repo(1, 'repo1', 'url1', 2, mockBranches, 'JavaScript', false),
      ];

      mockRequest.params = { orgName };
      mockRequest.query = { page, limit };

      (mockFetchReposUseCase.execute as jest.Mock).mockResolvedValue(mockRepos);

      // Act
      await controller.getReposByOrgName(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockFetchReposUseCase.execute).toHaveBeenCalledWith(
        orgName,
        parseInt(page, 10),
        parseInt(limit, 10),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ repos: mockRepos });
    });

    it('should return 400 if organization name is missing', async () => {
      // Arrange
      mockRequest.params = {};

      // Act
      await controller.getReposByOrgName(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Organization name is required',
      });
    });
  });

  describe('saveToDatabase', () => {
    it('should save repo successfully', async () => {
      // Arrange
      const mockBranches: Branch[] = [
        {
          name: 'main',
          commit: {
            sha: 'abc123',
            url: 'https://api.github.com/repos/testOrg/repo1/commits/abc123',
          },
          protected: false,
        },
      ];
      const mockRepo = new RepoDto(
        1,
        'repo1',
        'url1',
        2,
        mockBranches,
        'JavaScript',
        true,
      );

      mockRequest.body = mockRepo;
      (mockSaveRepoUseCase.execute as jest.Mock).mockResolvedValue(mockRepo);

      // Act
      await controller.saveToDatabase(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockSaveRepoUseCase.execute).toHaveBeenCalledWith(mockRepo);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ savedRepo: mockRepo });
    });

    it('should return 400 if repo data is missing', async () => {
      // Arrange
      mockRequest.body = null;

      // Act
      await controller.saveToDatabase(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Repository data is required',
      });
    });
  });

  describe('deleteRepo', () => {
    it('should delete repo successfully', async () => {
      // Arrange
      const repoId = '1';
      mockRequest.params = { id: repoId };
      (mockDeleteRepoUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      // Act
      await controller.deleteRepo(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockDeleteRepoUseCase.execute).toHaveBeenCalledWith(
        parseInt(repoId, 10),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Repo deleted successfully.',
      });
    });

    it('should handle invalid or missing repo ID', async () => {
      // Arrange
      mockRequest.params = {};

      // Act
      await controller.deleteRepo(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Repository ID is required',
      });
    });
  });
});
