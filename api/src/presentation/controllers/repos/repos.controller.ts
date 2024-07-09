import { Request, Response } from 'express';

import { asyncMiddleware } from '@/libs/shared/middlewares/async.middleware';

import { Repo, RepoDto, RepoRepository, SaveRepoUseCase } from '@/domain';

class ReposController {
  constructor(
    private readonly repoRepository: RepoRepository,
    private readonly saveRepoUseCase: SaveRepoUseCase,
  ) {}

  public getReposByOrgName = asyncMiddleware(
    async (req: Request, res: Response): Promise<Repo[]> => {
      const { orgName } = req.params;

      if (!orgName) {
        res.status(400).json({ error: 'Organization name is required' });
      }

      const repos = await this.repoRepository.fetchByOrgName(orgName);

      res.status(200).json({ repos });

      return repos;
    },
  );

  public saveToDatabase = asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const repo: RepoDto = req.body;

      if (!repo) {
        res.status(400).json({ error: 'Repository data is required' });
        return;
      }

      const savedRepo = await this.saveRepoUseCase.execute(repo);

      res.status(200).json({ savedRepo });
    },
  );
}

export default ReposController;
