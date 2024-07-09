import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repo.repository';

export class FetchReposUseCase {
  constructor(private repoRepository: RepoRepository) {}

  async execute(orgName: string): Promise<Repo[]> {
    const repos = await this.repoRepository.fetchByOrgName(orgName);

    return repos.map(repo => repo);
  }
}
