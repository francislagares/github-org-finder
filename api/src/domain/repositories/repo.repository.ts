import { Repo } from '@/domain/entities/repo';

export abstract class RepoRepository {
  abstract fetchByOrgName(orgName: string): Promise<Repo[]>;
}
