import { FetchReposUseCase, SaveRepoUseCase } from '@/domain';
import { RepoRepositoryImpl } from '@/infrastructure';
import { RepoDatasourceImpl } from '@/infrastructure/datasources/repo.datasource.impl';
import ReposController from '@/presentation/controllers/repos/repos.controller';

export function createReposController(): ReposController {
  const repoDatasource = new RepoDatasourceImpl();
  const repoRepository = new RepoRepositoryImpl(repoDatasource);

  const fetchReposUseCase = new FetchReposUseCase(repoRepository);
  const saveRepoUseCase = new SaveRepoUseCase(repoRepository);

  return new ReposController(fetchReposUseCase, saveRepoUseCase);
}
