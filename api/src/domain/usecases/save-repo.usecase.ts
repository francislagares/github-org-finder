import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repo.repository';

export class SaveRepoUseCase {
  constructor(private repoRepository: RepoRepository) {}

  async execute(repo: Repo): Promise<Repo> {
    return await this.repoRepository.saveRepo(repo);
  }
}
