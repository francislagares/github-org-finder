import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RepoDto } from '@/domain/dtos/repo.dto';
import { RepoDatasourceImpl } from '@/infrastructure/datasources/repo.datasource.impl';
import { ReposRoutes } from '@/presentation/routes/repos/repos.router';

import { mockData, mockDataSaved } from './mockData';

describe('ReposRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Initialize real implementations
    const reposRoutes = new ReposRoutes();
    app.use(reposRoutes.getRoutes());
  });

  it('should fetch repos by organization name with pagination', async () => {
    const mockFetchByOrgName = vi
      .spyOn(RepoDatasourceImpl.prototype, 'fetchByOrgName')
      .mockImplementation((_orgName, pageNum) => {
        if (pageNum === 1) {
          return Promise.resolve(mockData);
        }

        if (pageNum === 2) {
          return Promise.resolve(mockData);
        }

        return Promise.resolve([]);
      });

    // Test page 1
    let response = await request(app).get('/orgs/adobe/repos?page=1&limit=2');

    expect(response.status).toBe(200);
    expect(response.body.repos).toEqual(mockData);

    // Test page 2
    response = await request(app).get('/orgs/adobe/repos?page=2&limit=2');

    expect(response.status).toBe(200);
    expect(response.body.repos).toEqual(mockData);

    mockFetchByOrgName.mockRestore();
  });

  it('should save a repo to the database', async () => {
    const mockSaveRepo = vi
      .spyOn(RepoDatasourceImpl.prototype, 'saveRepo')
      .mockResolvedValue(mockDataSaved);

    const response = await request(app)
      .post('/repos/save')
      .send(mockDataSaved as RepoDto);

    expect(response.status).toBe(200);
    expect(response.body.savedRepo).toEqual(mockDataSaved);

    mockSaveRepo.mockRestore();
  });

  it('should delete a repo from the database', async () => {
    const mockDeleteRepo = vi
      .spyOn(RepoDatasourceImpl.prototype, 'deleteRepo')
      .mockResolvedValue();

    const response = await request(app).delete('/repos/2935735/delete');

    expect(response.status).toBe(200);

    mockDeleteRepo.mockRestore();
  });
});
