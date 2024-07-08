import { Repo } from '@/domain';
import { GithubApiDatasource } from '@/infrastructure/datasources/github.datasource';

export class GithubRepositoryImpl {
  constructor(private readonly githubApiDatasource: GithubApiDatasource) {}

  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
    return this.githubApiDatasource.fetchByOrgName(orgName);
  }
}
