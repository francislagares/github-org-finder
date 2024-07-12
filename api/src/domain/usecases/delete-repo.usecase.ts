import { RepoRepository } from '@/domain/repositories/repo.repository';

export class DeleteRepoUseCase {
  constructor(private repoRepository: RepoRepository) {}

  async execute(id: number): Promise<void> {
    return await this.repoRepository.deleteRepo(id);
  }
}
