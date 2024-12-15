import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { memo } from 'react';

import { defaultTableOptions } from './config/tableOptions';
import ExpandableRow from './ExpandableRow';
import { useTableDeletion } from './hooks/useTableDeletion';
import { useTableSelection } from './hooks/useTableSelection';
import { DataTableOptions, TableProps } from './types';

const DataTable = ({ data, columns, onSelectRow, onDeleteRow }: TableProps) => {
  const { selectedRows, setSelectedRows, handleRowSelection } =
    useTableSelection(data, onSelectRow);

  const { handleRowsDelete } = useTableDeletion(
    data,
    onDeleteRow,
    setSelectedRows,
  );

  const options: DataTableOptions = {
    ...defaultTableOptions,
    rowsSelected: selectedRows,
    onRowSelectionChange: handleRowSelection,
    onRowsDelete: handleRowsDelete,
    renderExpandableRow: (_rowData, rowMeta) => {
      const branchesList = data[rowMeta.rowIndex]?.branchesList;
      return <ExpandableRow branchesList={branchesList || []} />;
    },
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
