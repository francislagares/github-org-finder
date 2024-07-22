import { useInfiniteQuery } from '@tanstack/react-query';

import ApiService from '@/api/client';
import { Repo } from '@/models/repo';

const useRepos = (orgName: string, page?: number) => {
  const apiClient = new ApiService<Repo[]>(
    `/orgs/${orgName}/repos?page=${page}`,
  );

  return useInfiniteQuery<Repo[], Error>({
    queryKey: ['repos', orgName, page],
    queryFn: async ({ pageParam = page }) => {
      if (!orgName) return [];
      return await apiClient.getAll({ params: { page: pageParam } });
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default useRepos;
