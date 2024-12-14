import { Repo } from '@/domain/entities/repo';
import { useCallback, useState } from 'react';

import { TOAST_MESSAGES } from '@/presentation/components/DataTable/constants/toastMessages';
import { useToast } from '@/presentation/hooks/useToast';

import { RowSelectionInfo } from '../types';

export const useTableSelection = (
  data: Repo[],
  onSelectRow: (repo: Repo) => void,
) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [previouslySelected, setPreviouslySelected] = useState<Set<number>>(
    new Set(),
  );
  const { showSuccessMessage, showInfoMessage, showErrorMessage } = useToast();

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

      // Only handle selection events
      if (rowsSelected.includes(lastAction.index)) {
        try {
          if (previouslySelected.has(repo.id)) {
            showInfoMessage(TOAST_MESSAGES.REPO_PREVIOUSLY_SELECTED);
            return;
          }

          onSelectRow(repo);
          setPreviouslySelected(prev => new Set([...prev, repo.id]));
          showSuccessMessage(TOAST_MESSAGES.REPO_SAVE_SUCCESS);
        } catch (error) {
          showErrorMessage(
            error instanceof Error
              ? error.message
              : TOAST_MESSAGES.DEFAULT_ERROR,
          );
          // Remove the row from selection if save failed
          const newSelection = rowsSelected.filter(
            index => index !== lastAction.index,
          );
          setSelectedRows(newSelection);
          return;
        }
      }

      setSelectedRows(rowsSelected);
    },
    [data, onSelectRow, previouslySelected, showInfoMessage, showErrorMessage],
  );

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelection,
  };
};
