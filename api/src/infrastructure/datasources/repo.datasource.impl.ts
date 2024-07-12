import { CacheManager } from '@/libs/shared/redis/cache-manager';

import { RepoModel } from '@/data/mongodb/models/repo.model';
import { CustomError, Repo, RepoDatasource, RepoDto } from '@/domain';
import { RepoMapper } from '@/infrastructure/mappers/repo.mapper';

import { GithubApiDatasourceImpl } from './github.datasource.impl';

export class RepoDatasourceImpl implements RepoDatasource {
  private readonly redis: CacheManager;
  private githubApiDatasource = new GithubApiDatasourceImpl();
  private mapper = new RepoMapper();

  constructor() {
    this.redis = new CacheManager();
  }

  public async saveRepo(repoDto: RepoDto): Promise<Repo> {
    const { id, name, url, branches, branchesList, language, isChecked } =
      repoDto;
    try {
      const repoExists = await RepoModel.findOne({ githubId: id });

      if (repoExists) throw CustomError.badRequest('Repo already exists.');

      const repo = await RepoModel.create({
        githubId: id,
        name,
        url,
        branches,
        branchesList,
        language,
        isChecked,
      });

      await repo.save();

      return this.mapper.toDomain({
        id: repo.githubId,
        name: repo.name,
        url: repo.url,
        branches: repo.branches,
        branchesList: repo.branchesList,
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

  public async fetchByOrgName(
    orgName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Repo[]> {
    try {
      const cacheKey = `fetchByOrgName/repos/${orgName}/${page}/${limit}`;
      const cachedValue = await this.redis.getCache(cacheKey);

      if (cachedValue) {
        return JSON.parse(cachedValue);
      }

      // Fetch paginated repositories from GitHub API
      const githubRepos = await this.githubApiDatasource.fetchByOrgName(
        orgName,
        page,
        limit,
      );

      // Fetch all checked repositories from MongoDB
      const savedRepos = await RepoModel.find({ isChecked: true });

      // Map() provides more efficient lookups O(1)
      const savedReposMap = new Map(
        savedRepos.map(repo => [
          repo.githubId,
          this.mapper.toDTO({
            id: repo.githubId,
            name: repo.name,
            url: repo.url,
            branches: repo.branches,
            branchesList: repo.branchesList,
            language: repo.language,
            isChecked: repo.isChecked,
          }),
        ]),
      );

      // Combine results, prioritizing saved repos
      const combinedRepos = githubRepos.map(repo => {
        if (savedReposMap.has(repo.id)) {
          return { ...repo, ...savedReposMap.get(repo.id) };
        }
        return repo;
      });

      // Ensure no duplicates and include all saved repos
      savedRepos.forEach(repo => {
        if (!combinedRepos.some(r => r.id === repo.githubId)) {
          combinedRepos.push(
            this.mapper.toDTO({
              id: repo.githubId,
              name: repo.name,
              url: repo.url,
              branches: repo.branches,
              branchesList: repo.branchesList,
              language: repo.language,
              isChecked: repo.isChecked,
            }),
          );
        }
      });

      // Sort combinedRepos so that saved repos appear first
      combinedRepos.sort(
        (a, b) => (b.isChecked ? 1 : 0) - (a.isChecked ? 1 : 0),
      );

      await this.redis.setCache(cacheKey, combinedRepos);

      return combinedRepos;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
