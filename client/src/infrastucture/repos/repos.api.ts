import { Repo } from '@/domain/entities/repo';
import ApiService from '@/infrastucture/api/apiClient';

interface ReposResponse {
  repos: Repo[];
}

export const fetchReposByOrgName = async (
  orgName: string,
  page: number = 1,
  limit: number = 10,
): Promise<Repo[]> => {
  const service = new ApiService<ReposResponse>(`/orgs/${orgName}/repos`);

  const response = await service.getAll<ReposResponse>({
    params: { page, limit },
  });

  return response.repos;
};
