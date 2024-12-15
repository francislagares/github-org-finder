import { Repo } from '@/domain/entities/repo';

import { API_ENDPOINTS, API_OPERATIONS } from '@/constants';
import ApiService from '@/infrastucture/api/apiClient';

interface ReposResponse {
  repos: Repo[];
}

export const fetchReposByOrgName = async (
  orgName: string,
  page: number = 1,
  limit: number = 10,
): Promise<Repo[]> => {
  const service = new ApiService<ReposResponse>(
    `/${API_ENDPOINTS.ORGS}/${orgName}/${API_ENDPOINTS.REPOS}`,
  );

  const response = await service.getAllRepos<ReposResponse>({
    params: { page, limit },
  });

  return response.repos;
};

export const postFavoriteRepo = async (repo: Repo): Promise<void> => {
  const service = new ApiService(
    `/${API_ENDPOINTS.REPOS}/${API_OPERATIONS.POST}`,
  );

  await service.postRepo(repo);
};

export const deleteRepo = async (repoId: number): Promise<void> => {
  const service = new ApiService(
    `/${API_ENDPOINTS.REPOS}/${repoId}/${API_OPERATIONS.DELETE}`,
  );

  await service.deleteRepo();
};
