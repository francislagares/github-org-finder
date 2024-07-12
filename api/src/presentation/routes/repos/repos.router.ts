import express, { Router } from 'express';

import { createReposController } from '@/presentation/factories/reposFactory';

export class ReposRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public getRoutes(): Router {
    const controller = createReposController();

    this.router.get('/orgs/:orgName/repos', controller.getReposByOrgName);
    this.router.post('/repos/save', controller.saveToDatabase);
    this.router.delete('/repos/:id', controller.deleteRepo);

    return this.router;
  }
}

export const reposRoutes = new ReposRoutes();
