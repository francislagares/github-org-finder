import { Repo } from '@/domain/entities/repo';
import { useMutation } from '@tanstack/react-query';

import { DeleteRepoUseCase } from '@/application/usecases/deleteRepo';
import { RepoService } from '@/infrastucture/repos/repos.service';

const repoService = new RepoService();
const deleteRepoUseCase = new DeleteRepoUseCase(repoService);

export const useDeleteRepo = () => {
  return useMutation({
    mutationFn: async (repo: Repo) => {
      return await deleteRepoUseCase.execute(repo.id);
    },
    onSuccess: () => {
      console.log('Repository deleted successfully!');
    },
    onError: (error: typeof Error) => {
      console.error('Error on delete repository:', error);
    },
  });
};
