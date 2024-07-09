import express, { Router } from 'express';

import { SaveRepoUseCase } from '@/domain';
import {
  GithubApiDatasource,
  GithubRepositoryImpl,
  RepoRepositoryImpl,
} from '@/infrastructure';
import { RepoDatasourceImpl } from '@/infrastructure/datasources/repo.datasource.impl';
import ReposController from '@/presentation/controllers/repos/repos.controller';

export class ReposRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public getRoutes(): Router {
    const githubApiDatasource = new GithubApiDatasource();
    const repoDatasource = new RepoDatasourceImpl();
    const githubRepository = new GithubRepositoryImpl(githubApiDatasource);
    const repoRepository = new RepoRepositoryImpl(repoDatasource);

    const saveRepoUseCase = new SaveRepoUseCase(repoRepository);
    const controller = new ReposController(githubRepository, saveRepoUseCase);

    this.router.get('/orgs/:orgName/repos', controller.getReposByOrgName);
    this.router.post('/repos/save', controller.saveToDatabase);

    return this.router;
  }
}

export const reposRoutes = new ReposRoutes();
