import { useInfiniteQuery } from '@tanstack/react-query';

import { GetReposUseCase } from '@/application/usecases/getRepos';
import { RepoService } from '@/infrastucture/repos/repos.service';

const repoRepository = new RepoService();
const getReposUseCase = new GetReposUseCase(repoRepository);

const useRepos = (orgName: string) => {
  return useInfiniteQuery({
    queryKey: ['repos', orgName],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      if (!orgName) {
        return [];
      }
      return await getReposUseCase.execute({
        orgName,
        page: pageParam,
        limit: 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default useRepos;
