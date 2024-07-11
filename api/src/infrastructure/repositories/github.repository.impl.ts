import { Repo } from '@/domain';
import { GithubApiDatasourceImpl } from '@/infrastructure/datasources/github.datasource.impl';

export class GithubRepositoryImpl {
  constructor(private readonly githubApiDatasource: GithubApiDatasourceImpl) {}

  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
    return this.githubApiDatasource.fetchByOrgName(orgName);
  }
}
