import { RepoDto } from '@/domain/dtos/repo.dto';
import { Repo } from '@/domain/entities/repo';

export abstract class RepoDatasource {
  abstract save(repoDto: RepoDto): Promise<Repo>;
}
