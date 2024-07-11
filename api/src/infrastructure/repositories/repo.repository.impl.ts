import { RepoDatasource } from '@/domain';
import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repo.repository';

export class RepoRepositoryImpl implements RepoRepository {
  constructor(private repoDatasource: RepoDatasource) {}

  async fetchByOrgName(
    orgName: string,
    page: number,
    limit: number,
  ): Promise<Repo[]> {
    return await this.repoDatasource.fetchByOrgName(orgName, page, limit);
  }

  async saveRepo(repo: Repo): Promise<Repo> {
    return await this.repoDatasource.saveRepo(repo);
  }
}
