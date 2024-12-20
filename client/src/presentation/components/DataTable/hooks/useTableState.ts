import { Repo } from '@/domain/entities/repo';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/presentation/hooks/useToast';

import { TOAST_MESSAGES } from '../constants/toastMessages';

interface TableState {
  checkedRepos: Set<number>;
  selectedRows: number[];
  isUpdating: boolean;
  deletingRows: Set<number>;
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
    deletingRows: new Set<number>(),
  });

  const tableRef = useRef<HTMLTableElement | null>(null);
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
      deletingRows: new Set(),
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

  const removeTableRow = useCallback((rowIndex: number) => {
    if (!tableRef.current) return;

    const tbody = tableRef.current.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    const rowToRemove = rows[rowIndex];

    if (rowToRemove) {
      // Add fade-out animation
      rowToRemove.style.transition = 'opacity 0.3s ease-out';
      rowToRemove.style.opacity = '0';

      // Remove row after animation
      setTimeout(() => {
        rowToRemove.remove();

        // Update row indices and data attributes
        rows.forEach((row, idx) => {
          if (idx > rowIndex) {
            const newIndex = idx - 1;
            row.setAttribute('data-index', newIndex.toString());
          }
        });
      }, 300);
    }
  }, []);

  const updateSelection = useCallback(
    async (repo: Repo, rowIndex: number, isSelected: boolean) => {
      if (state.isUpdating || state.deletingRows.has(repo.id)) return;

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
    (rowsDeleted: {
      lookup: { [dataIndex: number]: boolean };
      data: { index: number; dataIndex: number }[];
    }) => {
      if (state.isUpdating) return false;

      const previousState = { ...state };

      // Handle deletions asynchronously without returning the promise
      (async () => {
        try {
          setState(prev => ({
            ...prev,
            isUpdating: true,
          }));

          // Mark rows as being deleted
          const deletingIds = new Set<number>();
          for (const { dataIndex } of rowsDeleted.data) {
            const repoToDelete = data[dataIndex];
            if (repoToDelete) {
              deletingIds.add(repoToDelete.id);
            }
          }

          setState(prev => ({
            ...prev,
            deletingRows: deletingIds,
          }));

          // Process deletions sequentially
          for (const { dataIndex } of rowsDeleted.data) {
            const repoToDelete = data[dataIndex];
            if (repoToDelete) {
              try {
                await onDeleteRow(repoToDelete);
                removeTableRow(dataIndex);
                setState(prev => ({
                  ...prev,
                  checkedRepos: new Set(
                    [...prev.checkedRepos].filter(id => id !== repoToDelete.id),
                  ),
                }));
                showSuccessMessage(TOAST_MESSAGES.REPO_DELETE_SUCCESS);
              } catch (error) {
                console.error(
                  `Failed to delete repo ${repoToDelete.id}:`,
                  error,
                );
                throw error;
              }
            }
          }

          setState(prev => ({
            ...prev,
            selectedRows: [],
            deletingRows: new Set(),
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
    [state, data, onDeleteRow, showSuccessMessage, handleError, removeTableRow],
  );

  return {
    checkedRepos: state.checkedRepos,
    selectedRows: state.selectedRows,
    isUpdating: state.isUpdating,
    deletingRows: state.deletingRows,
    updateSelection,
    handleDelete,
    tableRef,
  };
};
