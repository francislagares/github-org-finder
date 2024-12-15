import { Repo } from '@/domain/entities/repo';
import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/presentation/hooks/useToast';

import { TOAST_MESSAGES } from '../constants/toastMessages';

interface TableState {
  checkedRepos: Set<number>;
  selectedRows: number[];
  isUpdating: boolean;
}

export const useTableState = (
  data: Repo[],
  onSelectRow: (repo: Repo) => Promise<void>,
  onDeleteRow: (repo: Repo) => Promise<void>,
) => {
  const [state, setState] = useState<TableState>({
    checkedRepos: new Set<number>(),
    selectedRows: [],
    isUpdating: false,
  });

  const { showSuccessMessage, showErrorMessage } = useToast();

  // Sync state with incoming data
  useEffect(() => {
    const checkedRepos = new Set(
      data.filter(repo => repo.isChecked).map(repo => repo.id),
    );
    const selectedRows = data
      .map((repo, index) => (repo.isChecked ? index : -1))
      .filter(index => index !== -1);

    setState(prev => ({
      ...prev,
      checkedRepos,
      selectedRows,
    }));
  }, [data]);

  const handleError = useCallback(
    (error: unknown, revertState: () => void) => {
      revertState();
      showErrorMessage(
        error instanceof Error ? error.message : TOAST_MESSAGES.DEFAULT_ERROR,
      );
    },
    [showErrorMessage],
  );

  const updateSelection = useCallback(
    async (repo: Repo, rowIndex: number, isSelected: boolean) => {
      if (state.isUpdating) return;

      const previousState = { ...state };
      try {
        setState(prev => ({
          ...prev,
          isUpdating: true,
        }));

        // Optimistic update
        setState(prev => ({
          ...prev,
          checkedRepos: new Set(
            isSelected
              ? [...prev.checkedRepos, repo.id]
              : [...prev.checkedRepos].filter(id => id !== repo.id),
          ),
          selectedRows: isSelected
            ? [...prev.selectedRows, rowIndex]
            : prev.selectedRows.filter(index => index !== rowIndex),
        }));

        const updatedRepo = { ...repo, isChecked: isSelected };
        await onSelectRow(updatedRepo);
        showSuccessMessage(
          isSelected
            ? TOAST_MESSAGES.REPO_SAVE_SUCCESS
            : TOAST_MESSAGES.REPO_DELETE_SUCCESS,
        );
      } catch (error) {
        handleError(error, () => setState(previousState));
      } finally {
        setState(prev => ({
          ...prev,
          isUpdating: false,
        }));
      }
    },
    [state, onSelectRow, showSuccessMessage, handleError],
  );

  const handleDelete = useCallback(
    (
      rowsDeleted: {
        lookup: { [dataIndex: number]: boolean };
        data: { index: number; dataIndex: number }[];
      },
      _newTableData: Repo[],
    ) => {
      if (state.isUpdating) return false;

      // Start the deletion process asynchronously
      (async () => {
        const previousState = { ...state };
        try {
          setState(prev => ({
            ...prev,
            isUpdating: true,
          }));

          for (const { dataIndex } of rowsDeleted.data) {
            const repoToDelete = data[dataIndex];
            if (repoToDelete) {
              await onDeleteRow(repoToDelete);
              setState(prev => ({
                ...prev,
                checkedRepos: new Set(
                  [...prev.checkedRepos].filter(id => id !== repoToDelete.id),
                ),
              }));
              showSuccessMessage(TOAST_MESSAGES.REPO_DELETE_SUCCESS);
            }
          }

          setState(prev => ({
            ...prev,
            selectedRows: [],
          }));
        } catch (error) {
          handleError(error, () => setState(previousState));
        } finally {
          setState(prev => ({
            ...prev,
            isUpdating: false,
          }));
        }
      })();
      return false; // Prevent default deletion behavior
    },
    [state, data, onDeleteRow, showSuccessMessage, handleError],
  );

  return {
    checkedRepos: state.checkedRepos,
    selectedRows: state.selectedRows,
    isUpdating: state.isUpdating,
    updateSelection,
    handleDelete,
  };
};
