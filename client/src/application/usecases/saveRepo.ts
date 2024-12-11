import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repos.repository';

export interface SaveReposParams {
  repo: Repo;
}

export class SaveRepoUseCase {
  private repoRepository: RepoRepository;

  constructor(repoRepository: RepoRepository) {
    this.repoRepository = repoRepository;
  }

  public async execute(selectedRepo: SaveReposParams): Promise<void> {
    const { repo } = selectedRepo;

    if (!repo) {
      throw new Error('Repository is required');
    }

    await this.repoRepository.saveFavoriteRepo(repo);
  }
}
