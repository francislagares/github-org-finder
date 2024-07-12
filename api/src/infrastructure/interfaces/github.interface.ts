import { Repo } from '@/domain';

export interface GithubApiInterface {
  fetchByOrgName: (
    orgName: string,
    pageNum: number,
    limit: number,
  ) => Promise<Repo[]>;
}
