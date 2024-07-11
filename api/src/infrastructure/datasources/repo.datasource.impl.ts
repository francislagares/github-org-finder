import { RepoModel } from '@/data/mongodb/models/repo.model';
import { CustomError, Repo, RepoDatasource, RepoDto } from '@/domain';
import { RepoMapper } from '@/infrastructure/mappers/repo.mapper';

import { GithubApiDatasourceImpl } from './github.datasource.impl';

export class RepoDatasourceImpl implements RepoDatasource {
  private githubApiDatasource = new GithubApiDatasourceImpl();
  private mapper = new RepoMapper();

  public async saveRepo(repoDto: RepoDto): Promise<Repo> {
    const { id, name, url, branches, language, isChecked } = repoDto;
    try {
      const repoExists = await RepoModel.findOne({ githubId: id });

      if (repoExists) throw CustomError.badRequest('Repo already exists.');

      const repo = await RepoModel.create({
        githubId: id,
        name,
        url,
        branches,
        language,
        isChecked,
      });

      await repo.save();

      return this.mapper.toDomain({
        id: repo.githubId,
        name: repo.name,
        url: repo.url,
        branches: repo.branches,
        language: repo.language,
        isChecked: repo.isChecked,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
    try {
      const githubRepos =
        await this.githubApiDatasource.fetchByOrgName(orgName);
      const savedRepos = await RepoModel.find({ isChecked: true });

      const savedReposMap = new Map( // Map() provides more efficient lookups O(1)
        savedRepos.map(repo => [
          repo.githubId,
          this.mapper.toDTO({
            id: repo.githubId,
            name: repo.name,
            url: repo.url,
            branches: repo.branches,
            language: repo.language,
            isChecked: repo.isChecked,
          }),
        ]),
      );

      const combinedRepos = githubRepos.map(repo => {
        if (savedReposMap.has(repo.id)) {
          return { ...repo, ...savedReposMap.get(repo.id) };
        }
        return repo;
      });

      savedRepos.forEach(repo => {
        if (!combinedRepos.some(r => r.id === repo.githubId)) {
          combinedRepos.push(
            this.mapper.toDTO({
              id: repo.githubId,
              name: repo.name,
              url: repo.url,
              branches: repo.branches,
              language: repo.language,
              isChecked: repo.isChecked,
            }),
          );
        }
      });

      return combinedRepos;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
