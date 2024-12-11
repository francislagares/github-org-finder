import { Repo } from '@/domain/entities/repo';

export interface RepoRepository {
  getReposByOrgName(
    orgName: string,
    page: number,
    limit: number,
  ): Promise<Repo[]>;
  saveFavoriteRepo(repo: Repo): Promise<void>;
  deleteFavoriteRepo(): Promise<Repo[]>;
}
