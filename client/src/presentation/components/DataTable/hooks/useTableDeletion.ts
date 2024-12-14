import { Repo } from '@/domain/entities/repo';
import { useCallback } from 'react';

import { DeletedRows } from '@/presentation/components/DataTable/types';
import { useToast } from '@/presentation/hooks/useToast';

import { TOAST_MESSAGES } from '../constants/toastMessages';

export const useTableDeletion = (
  data: Repo[],
  onDeleteRow: (repo: Repo) => void,
  setSelectedRows: (rows: number[]) => void,
) => {
  const { showSuccessMessage } = useToast();

  const handleRowsDelete = useCallback(
    (rowsDeleted: DeletedRows) => {
      rowsDeleted.data.forEach(({ dataIndex }) => {
        const repoToDelete = data[dataIndex];
        if (repoToDelete) {
          onDeleteRow(repoToDelete);
          showSuccessMessage(TOAST_MESSAGES.REPO_DELETE_SUCCESS);
        }
      });

      // Clear selection after deletion
      setSelectedRows([]);

      return false; // Prevent default deletion behavior
    },
    [data, onDeleteRow, setSelectedRows],
  );

  return { handleRowsDelete };
};
