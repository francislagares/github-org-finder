import { Repo } from '@/domain/entities/repo';
import { useCallback, useRef } from 'react';

import { useToast } from '@/presentation/hooks/useToast';

import { TOAST_MESSAGES } from '../constants/toastMessages';

export const useCheckedRepos = () => {
  const checkedReposRef = useRef<Set<number>>(new Set());
  const { showInfoMessage } = useToast();

  const isRepoChecked = useCallback((repoId: number): boolean => {
    return checkedReposRef.current.has(repoId);
  }, []);

  const addCheckedRepo = useCallback((repoId: number): void => {
    checkedReposRef.current.add(repoId);
  }, []);

  const removeCheckedRepo = useCallback((repoId: number): void => {
    checkedReposRef.current.delete(repoId);
  }, []);

  const handleRepoCheck = useCallback(
    (repo: Repo): boolean => {
      if (isRepoChecked(repo.id)) {
        showInfoMessage(TOAST_MESSAGES.REPO_PREVIOUSLY_SELECTED);
        return false;
      }
      addCheckedRepo(repo.id);
      return true;
    },
    [addCheckedRepo, isRepoChecked, showInfoMessage],
  );

  return {
    isRepoChecked,
    handleRepoCheck,
    removeCheckedRepo,
  };
};
