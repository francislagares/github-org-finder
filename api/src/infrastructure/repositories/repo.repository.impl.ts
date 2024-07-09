import { Repo, RepoDatasource, RepoDto } from '@/domain';

export class RepoRepositoryImpl {
  constructor(private readonly repoDatasource: RepoDatasource) {}

  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
    return this.repoDatasource.fetchByOrgName(orgName);
  }

  public async saveRepo(repo: RepoDto): Promise<Repo> {
    return this.repoDatasource.saveRepo(repo);
  }
}
