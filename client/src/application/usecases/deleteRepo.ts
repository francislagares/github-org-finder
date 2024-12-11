import { RepoRepository } from '@/domain/repositories/repos.repository';

export class DeleteRepoUseCase {
  private repoRepository: RepoRepository;

  constructor(repoRepository: RepoRepository) {
    this.repoRepository = repoRepository;
  }

  public async execute(repoId: number): Promise<void> {
    await this.repoRepository.deleteFavoriteRepo(repoId);
  }
}
