import MUIDataTable, { FilterType, MUIDataTableOptions } from 'mui-datatables';

import ExpandableRow from './ExpandableRow';
import { useTableDeletion } from './hooks/useTableDeletion';
import { useTableSelection } from './hooks/useTableSelection';
import { TableProps } from './types';

const DataTable = ({ data, columns, onSelectRow, onDeleteRow }: TableProps) => {
  const { selectedRows, setSelectedRows, handleRowSelection } =
    useTableSelection(data, onSelectRow);

  const { handleRowsDelete } = useTableDeletion(
    data,
    onDeleteRow,
    setSelectedRows,
  );

  const options: MUIDataTableOptions = {
    filter: true,
    filterType: 'dropdown' as FilterType,
    responsive: 'standard',
    pagination: false,
    rowsPerPage: 10,
    serverSide: true,
    expandableRows: true,
    selectableRows: 'multiple',
    rowsSelected: selectedRows,
    textLabels: {
      selectedRows: {
        text: 'row(s) selected',
        delete: 'Delete',
        deleteAria: 'Delete Selected Rows',
      },
    },
    onRowSelectionChange: handleRowSelection,
    onRowsDelete: handleRowsDelete,
    renderExpandableRow: (_rowData, rowMeta) => {
      const branchesList = data[rowMeta.rowIndex]?.branchesList;
      return <ExpandableRow branchesList={branchesList || []} />;
    },
  };

  return (
    <MUIDataTable
      title='List of Repositories'
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default DataTable;
