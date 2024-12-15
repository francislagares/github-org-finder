import { Repo } from '@/domain/entities/repo';
import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/presentation/hooks/useToast';

import { TOAST_MESSAGES } from '../constants/toastMessages';
import { RowSelectionInfo } from '../types';

import { useCheckedRepos } from './useCheckedRepos';

export const useTableSelection = (
  data: Repo[],
  onSelectRow: (repo: Repo) => void,
) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { handleRepoCheck, removeCheckedRepo } = useCheckedRepos();
  const { showSuccessMessage, showErrorMessage } = useToast();

  useEffect(() => {
    const newSelectedRows = data
      .map((repo, index) => (repo.isChecked ? index : -1))
      .filter(index => index !== -1);

    setSelectedRows(newSelectedRows);
  }, [data]);

  const handleRowSelection = useCallback(
    async (
      currentRowsSelected: RowSelectionInfo[],
      _allRowsSelected: RowSelectionInfo[],
      rowsSelected: number[],
    ) => {
      const lastAction = currentRowsSelected[currentRowsSelected.length - 1];
      if (!lastAction) return;

      const repo = data[lastAction.dataIndex];
      if (!repo) return;

      if (rowsSelected.includes(lastAction.index)) {
        try {
          // Check if repo was previously selected
          if (!handleRepoCheck(repo)) {
            // Revert selection if repo was previously selected
            const revertedSelection = rowsSelected.filter(
              index => index !== lastAction.index,
            );
            setSelectedRows(revertedSelection);
            return;
          }

          const updatedRepo = { ...repo, isChecked: true };
          await onSelectRow(updatedRepo);
          showSuccessMessage(TOAST_MESSAGES.REPO_SAVE_SUCCESS);
        } catch (error) {
          showErrorMessage(
            error instanceof Error
              ? error.message
              : TOAST_MESSAGES.DEFAULT_ERROR,
          );
          removeCheckedRepo(repo.id);
          const revertedSelection = rowsSelected.filter(
            index => index !== lastAction.index,
          );
          setSelectedRows(revertedSelection);
          return;
        }
      }

      setSelectedRows(rowsSelected);
    },
    [
      data,
      onSelectRow,
      handleRepoCheck,
      removeCheckedRepo,
      showSuccessMessage,
      showErrorMessage,
    ],
  );

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelection,
  };
};
