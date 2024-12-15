import { Repo } from '@/domain/entities/repo';

export const createReposMap = (
  repos: Repo[],
  criteria: (repo: Repo) => boolean,
) => {
  return new Map(repos.filter(criteria).map(repo => [repo.id, repo]));
};

export const sortReposByCheckedStatus = (repos: Repo[]) => {
  const checkedReposMap = createReposMap(repos, repo => repo.isChecked);
  const uncheckedReposMap = createReposMap(repos, repo => !repo.isChecked);

  return {
    uniqueCheckedRepos: Array.from(checkedReposMap.values()),
    uniqueUncheckedRepos: Array.from(uncheckedReposMap.values()),
  };
};
