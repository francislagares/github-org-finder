import { Repo } from '@/domain/entities/repo';

export abstract class GithubRepository {
  abstract fetchByOrgName(
    orgName: string,
    pageNum: number,
    limit: number,
  ): Promise<Repo[]>;
}
