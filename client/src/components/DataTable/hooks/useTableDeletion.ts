import { useCallback } from 'react';

import { DeletedRows } from '@/components/DataTable/types';

import { Repo } from '@/domain/entities/repo';

export const useTableDeletion = (
  data: Repo[],
  onDeleteRow: (repo: Repo) => void,
  setSelectedRows: (rows: number[]) => void,
) => {
  const handleRowsDelete = useCallback(
    (rowsDeleted: DeletedRows) => {
      rowsDeleted.data.forEach(({ dataIndex }) => {
        const repoToDelete = data[dataIndex];
        if (repoToDelete) {
          onDeleteRow(repoToDelete);
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
