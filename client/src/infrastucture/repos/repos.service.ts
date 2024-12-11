import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repos.repository';

import { dtoToRepo } from './mapperDto';
import { deleteRepo, fetchReposByOrgName, postFavoriteRepo } from './repos.api';

export class RepoService implements RepoRepository {
  async getReposByOrgName(
    orgName: string,
    page: number,
    limit: number,
  ): Promise<Repo[]> {
    const reposDto = await fetchReposByOrgName(orgName, page, limit);

    return reposDto.map(dtoToRepo);
  }

  async saveFavoriteRepo(repo: Repo): Promise<void> {
    await postFavoriteRepo(repo);
  }

  async deleteFavoriteRepo(repoId: number): Promise<void> {
    await deleteRepo(repoId);
  }
}
