import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RepoDto } from '@/domain/dtos/repo.dto';
import { RepoDatasourceImpl } from '@/infrastructure/datasources/repo.datasource.impl';
import { ReposRoutes } from '@/presentation/routes/repos/repos.router';

describe('ReposRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Initialize real implementations
    const reposRoutes = new ReposRoutes();
    app.use(reposRoutes.getRoutes());
  });

  it('should fetch repos by organization name', async () => {
    const mockData = [
      {
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: true,
      },
      {
        id: 2935735,
        name: 'brackets',
        url: 'https://api.github.com/repos/adobe/brackets',
        branches: 30,
        language: 'JavaScript',
        isChecked: false,
      },
    ];

    const mockFetchByOrgName = vi
      .spyOn(RepoDatasourceImpl.prototype, 'fetchByOrgName')
      .mockResolvedValue(mockData);

    const response = await request(app).get('/orgs/adobe/repos');

    expect(response.status).toBe(200);
    expect(response.body.repos).toEqual([
      {
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: true,
      },
      {
        id: 2935735,
        name: 'brackets',
        url: 'https://api.github.com/repos/adobe/brackets',
        branches: 30,
        language: 'JavaScript',
        isChecked: false,
      },
    ]);

    mockFetchByOrgName.mockRestore();
  });

  it('should save a repo to the database', async () => {
    const mockSaveRepo = vi
      .spyOn(RepoDatasourceImpl.prototype, 'saveRepo')
      .mockResolvedValue({
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: true,
      });

    const response = await request(app)
      .post('/repos/save')
      .send({
        id: 2935646,
        name: 'brackets-app',
        url: 'https://api.github.com/repos/adobe/brackets-app',
        branches: 6,
        language: 'C++',
        isChecked: true,
      } as RepoDto);

    expect(response.status).toBe(200);
    expect(response.body.savedRepo).toEqual({
      id: 2935646,
      name: 'brackets-app',
      url: 'https://api.github.com/repos/adobe/brackets-app',
      branches: 6,
      language: 'C++',
      isChecked: true,
    });

    mockSaveRepo.mockRestore();
  });
});
