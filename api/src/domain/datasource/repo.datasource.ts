import { RepoDto } from '@/domain/dtos/repo.dto';
import { Repo } from '@/domain/entities/repo';

export abstract class RepoDatasource {
  abstract fetchByOrgName(orgName: string): Promise<Repo[]>;
  abstract saveRepo(repoDto: RepoDto): Promise<Repo>;
}
