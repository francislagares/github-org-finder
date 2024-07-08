import { Repo } from '@/domain/entities/repo';

export abstract class RepoDatasource {
  abstract fetchByOrgName(orgName: string): Promise<Repo[]>;
}
