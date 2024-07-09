import { Repo, RepoDatasource } from '@/domain';

export class RepoRepositoryImpl {
  constructor(private readonly repoDatasource: RepoDatasource) {}

  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
    return this.repoDatasource.fetchByOrgName(orgName);
  }
}
