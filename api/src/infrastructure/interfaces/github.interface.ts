import { Repo } from '@/domain';

export interface GithubApiInterface {
  fetchByOrgName: (orgName: string) => Promise<Repo[]>;
}
