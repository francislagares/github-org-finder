import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { memo } from 'react';

import { defaultTableOptions } from './config/tableOptions';
import ExpandableRow from './ExpandableRow';
import { useTableState } from './hooks/useTableState';
import { DataTableOptions, TableProps } from './types';

const DataTable = ({ data, columns, onSelectRow, onDeleteRow }: TableProps) => {
  const { selectedRows, isUpdating, updateSelection, handleDelete } =
    useTableState(data, onSelectRow, onDeleteRow);

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
    isRowSelectable: () => !isUpdating,
  };

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
