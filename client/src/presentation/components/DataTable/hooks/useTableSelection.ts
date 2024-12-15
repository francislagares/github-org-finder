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
  const { handleRepoCheck } = useCheckedRepos();
  const { showSuccessMessage, showErrorMessage } = useToast();

  useEffect(() => {
    const initialSelectedRows = data
      .map((repo, index) => (repo.isChecked ? index : -1))
      .filter(index => index !== -1);

    setSelectedRows(initialSelectedRows);
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

      try {
        if (rowsSelected.includes(lastAction.index)) {
          // Select row
          if (!handleRepoCheck(repo)) {
            // Si ya estaba seleccionado, revertimos
            setSelectedRows(prev =>
              prev.filter(index => index !== lastAction.index),
            );

            return;
          }
          const updatedRepo = { ...repo, isChecked: true };

          onSelectRow(updatedRepo);
          showSuccessMessage(TOAST_MESSAGES.REPO_SAVE_SUCCESS);
        } else {
          // Deselect
          const updatedRepo = { ...repo, isChecked: false };

          onSelectRow(updatedRepo);
          showSuccessMessage(TOAST_MESSAGES.REPO_DELETE_SUCCESS);
        }

        setSelectedRows(rowsSelected);
      } catch (error) {
        showErrorMessage(
          error instanceof Error ? error.message : TOAST_MESSAGES.DEFAULT_ERROR,
        );
        setSelectedRows(prev =>
          rowsSelected.includes(lastAction.index)
            ? prev.filter(index => index !== lastAction.index) // Revert rows
            : [...prev, lastAction.index],
        );
      }
    },
    [data, handleRepoCheck, onSelectRow, showSuccessMessage, showErrorMessage],
  );

  return { selectedRows, setSelectedRows, handleRowSelection };
};
