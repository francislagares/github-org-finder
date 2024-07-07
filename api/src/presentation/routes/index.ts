import { Application } from 'express';

import { serverSchema } from '@/config/environment';

import { healthRoutes } from './health/health.router';
import { reposRoutes } from './repos/repos.router';

const applicationRoutes = (app: Application) => {
  const routes = () => {
    app.use(serverSchema.BASE_URL, healthRoutes.getRoutes());
    app.use(serverSchema.BASE_URL, reposRoutes.getRoutes());
  };

  routes();
};

export default applicationRoutes;
