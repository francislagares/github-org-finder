import { Repo } from '@/domain/entities/repo';

import { RepoRepository } from '@/domain/repositories/repos.repository';

import { dtoToRepo } from './mapperDto';
import { fetchReposByOrgName } from './repos.api';

export class RepoService implements RepoRepository {
  async getReposByOrgName(
    orgName: string,
    page: number,
    limit: number,
  ): Promise<Repo[]> {
    const productDtos = await fetchReposByOrgName(orgName, page, limit);

    return productDtos.map(dtoToRepo);
  }
}
