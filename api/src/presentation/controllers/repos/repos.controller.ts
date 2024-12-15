import { Request, Response } from 'express';

import { asyncMiddleware } from '@/libs/shared/middlewares/async.middleware';

import {
  DeleteRepoUseCase,
  FetchReposUseCase,
  Repo,
  RepoDto,
  SaveRepoUseCase,
} from '@/domain';

class ReposController {
  constructor(
    private readonly fetchRepoUseCase: FetchReposUseCase,
    private readonly saveRepoUseCase: SaveRepoUseCase,
    private readonly deleteRepoUseCase: DeleteRepoUseCase,
  ) {}

  public getReposByOrgName = asyncMiddleware(
    async (req: Request, res: Response): Promise<Repo[] | void> => {
      const { orgName } = req.params;
      const { page, limit } = req.query;

      const pageNum = parseInt(page as string, 10) || 1;
      const perPageNum = parseInt(limit as string, 10) || 10;

      if (!orgName) {
        res.status(400).json({ error: 'Organization name is required' });

        return;
      }

      const repos = await this.fetchRepoUseCase.execute(
        orgName,
        pageNum,
        perPageNum,
      );

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

  public deleteRepo = asyncMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Repository ID is required' });
        return;
      }

      await this.deleteRepoUseCase.execute(parseInt(id));

      res.status(200).json({ message: 'Repo deleted successfully.' });
    },
  );
}

export default ReposController;
