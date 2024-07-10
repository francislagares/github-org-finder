import { Repo } from '@/domain/entities/repo';
import { RepoRepository } from '@/domain/repositories/repo.repository';

export class FetchReposUseCase {
  constructor(private repoRepository: RepoRepository) {}

  async execute(orgName: string): Promise<Repo[]> {
    return await this.repoRepository.fetchByOrgName(orgName);
  }
}
