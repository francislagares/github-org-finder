import { Repo } from '@/domain/entities/repo';

export abstract class RepoRepository {
  abstract fetchByOrgName(
    orgName: string,
    pageNum: number,
    limit: number,
  ): Promise<Repo[]>;
  abstract saveRepo(repo: Repo): Promise<Repo>;
  abstract deleteRepo(id: number): Promise<void>;
}
