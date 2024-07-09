import express, { Router } from 'express';

import { GithubApiDatasource, GithubRepositoryImpl } from '@/infrastructure';
import ReposController from '@/presentation/controllers/repos/repos.controller';

export class ReposRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public getRoutes(): Router {
    const githubApiDatasource = new GithubApiDatasource();
    const githubRepository = new GithubRepositoryImpl(githubApiDatasource);
    const controller = new ReposController(githubRepository);

    this.router.get('/orgs/:orgName/repos', controller.getReposByOrgName);

    return this.router;
  }
}

export const reposRoutes = new ReposRoutes();
