import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { memo, useEffect } from 'react';

import { useTableFiltering } from '@/presentation/components/DataTable/hooks/useTableFiltering';
import { useTableState } from '@/presentation/components/DataTable/hooks/useTableState';

import { defaultTableOptions } from './config/tableOptions';
import ExpandableRow from './ExpandableRow';
import { DataTableOptions, TableProps } from './types';

const DataTable = ({
  data,
  columns,
  onSelectRow,
  onDeleteRow,
  searchTerm = '', // Add searchTerm prop
}: TableProps) => {
  const {
    selectedRows,
    isUpdating,
    deletingRows,
    updateSelection,
    handleDelete,
    tableRef,
  } = useTableState(data, onSelectRow, onDeleteRow);

  const { filterTable } = useTableFiltering(data);

  // Filter table when searchTerm changes
  useEffect(() => {
    if (searchTerm && tableRef.current) {
      filterTable(searchTerm, tableRef);
    }
  }, [searchTerm, filterTable, tableRef]);

  const handleRowSelection = async (
    currentRowsSelected: { index: number; dataIndex: number }[],
    _allRowsSelected: { index: number; dataIndex: number }[],
    rowsSelected: number[],
  ) => {
    const lastAction = currentRowsSelected[currentRowsSelected.length - 1];
    if (!lastAction) return;

    const repo = data[lastAction.dataIndex];
    if (!repo) return;

    await updateSelection(
      repo,
      lastAction.index,
      rowsSelected.includes(lastAction.index),
    );
  };

  const options: DataTableOptions = {
    ...defaultTableOptions,
    rowsSelected: selectedRows,
    onRowSelectionChange: handleRowSelection,
    onRowsDelete: handleDelete,
    renderExpandableRow: (_rowData, rowMeta) => {
      const branchesList = data[rowMeta.rowIndex]?.branchesList;
      return <ExpandableRow branchesList={branchesList || []} />;
    },
    isRowSelectable: rowIndex => {
      const repo = data[rowIndex];
      return !isUpdating && !deletingRows.has(repo.id);
    },
    setTableProps: () => ({
      ref: tableRef,
    }),
  };

  if (!data.length) {
    return (
      <div role="alert" className="text-center p-4">
        No repositories found
      </div>
    );
  }

  return (
    <MUIDataTable
      title="List of Repositories"
      data={data}
      columns={columns}
      options={options as MUIDataTableOptions}
    />
  );
};

export default memo(DataTable);
