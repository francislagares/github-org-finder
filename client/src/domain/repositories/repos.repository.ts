import { Repo } from '@/domain/entities/repo';

export interface RepoRepository {
  getReposByOrgName(
    orgName: string,
    page: number,
    limit: number,
  ): Promise<Repo[]>;
  saveFavoriteRepo(repoId: string): Promise<void>;
  deleteFavoriteRepo(): Promise<Repo[]>;
}
