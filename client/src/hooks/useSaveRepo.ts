import { useMutation } from '@tanstack/react-query';

import { SaveRepoUseCase } from '@/application/usecases/saveRepo';
import { Repo } from '@/domain/entities/repo';
import { RepoService } from '@/infrastucture/repos/repos.service';

const repoService = new RepoService();
const saveRepoUseCase = new SaveRepoUseCase(repoService);

export const useSaveRepo = () => {
  return useMutation({
    mutationFn: async (repo: Repo) => {
      return await saveRepoUseCase.execute({ repo });
    },
    onSuccess: () => {
      console.log('Repository saved successfully!');
    },
    onError: (error: typeof Error) => {
      console.error('Error saving repository:', error);
    },
  });
};
