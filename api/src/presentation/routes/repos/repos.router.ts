import express, { Router } from 'express';

import ReposController from '@/presentation/controllers/repos/repos.controller';

export class ReposRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public getRoutes(): Router {
    const controller = new ReposController();

    this.router.get('/repos/', controller.getReposByOrgName);

    return this.router;
  }
}

export const reposRoutes = new ReposRoutes();
