import { RepoDto } from '@/domain/dtos/repo.dto';
import { Repo } from '@/domain/entities/repo';

export abstract class RepoRepository {
  abstract save(repoDto: RepoDto): Promise<Repo>;
}
