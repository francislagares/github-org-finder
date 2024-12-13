import { Repo } from '@/domain/entities/repo';
import { useCallback, useState } from 'react';

import { RowSelectionInfo } from '@/presentation/components/DataTable/types';

export const useTableSelection = (
  data: Repo[],
  onSelectRow: (repo: Repo) => void,
) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowSelection = useCallback(
    (
      currentRowsSelected: RowSelectionInfo[],
      _allRowsSelected: RowSelectionInfo[],
      rowsSelected: number[],
    ) => {
      // Get the last action (the row that triggered this event)
      const lastSelected = currentRowsSelected[currentRowsSelected.length - 1];

      // If we have more selected rows than before, it means a new row was selected
      if (rowsSelected.length > selectedRows.length && lastSelected) {
        const selectedRepo = data[lastSelected.dataIndex];
        if (selectedRepo) {
          onSelectRow(selectedRepo);
        }
      }

      // Update selected rows state
      setSelectedRows(rowsSelected);
    },
    [data, onSelectRow, selectedRows],
  );

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelection,
  };
};
