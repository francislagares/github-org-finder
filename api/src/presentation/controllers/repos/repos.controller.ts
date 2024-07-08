import { Request, Response } from 'express';

import { asyncMiddleware } from '@/libs/shared/middlewares/async.middleware';

import { Repo, RepoRepository } from '@/domain';

class ReposController {
  constructor(private readonly repoRepository: RepoRepository) {}

  public getReposByOrgName = asyncMiddleware(
    async (req: Request, res: Response): Promise<Repo[]> => {
      const { orgName } = req.params;

      if (!orgName) {
        res.status(400).json({ error: 'Organization name is required' });
      }

      const repos = await this.repoRepository.fetchByOrgName(orgName);

      res.status(200).json({ data: repos });

      return repos;
    },
  );
}

export default ReposController;
