import { Repo } from '@/domain/entities/repo';
import { useCallback, useRef } from 'react';

import { filterUtils } from '@/presentation/components/DataTable/utils/filterUtils';
import { tableOperations } from '@/presentation/components/DataTable/utils/tableManipulation';

export const useTableFiltering = (data: Repo[]) => {
  const filteringInProgress = useRef(false);

  const filterTable = useCallback(
    async (
      searchTerm: string,
      tableRef: React.RefObject<HTMLTableElement | null>,
    ) => {
      if (filteringInProgress.current || !tableRef.current) return;

      const tbody = tableRef.current.querySelector('tbody');
      if (!tbody) return;

      try {
        filteringInProgress.current = true;

        // Get rows that don't match the search
        const rowsToRemove = filterUtils.getRowsToRemove(
          tbody,
          data,
          searchTerm,
        );

        // Remove non-matching rows with animation
        await Promise.all(
          rowsToRemove.map(row => tableOperations.removeRow(row)),
        );

        // Update indices of remaining rows
        tableOperations.updateRowIndices(tbody, 0);
      } finally {
        filteringInProgress.current = false;
      }
    },
    [data],
  );

  return { filterTable };
};
