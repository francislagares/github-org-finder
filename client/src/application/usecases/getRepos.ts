import { Repo } from '@/domain/entities/repo';

import { RepoRepository } from '@/domain/repositories/repos.repository';

export interface GetReposParams {
  orgName: string;
  page: number;
  limit: number;
}

export class GetReposUseCase {
  private repoRepository: RepoRepository;

  constructor(repoRepository: RepoRepository) {
    this.repoRepository = repoRepository;
  }

  public async execute(params: GetReposParams): Promise<Repo[]> {
    const { orgName, page, limit } = params;
    return this.repoRepository.getReposByOrgName(orgName, page, limit);
  }
}
