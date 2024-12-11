import MUIDataTable, { FilterType, MUIDataTableOptions } from 'mui-datatables';

import { Repo } from '@/domain/entities/repo';

import { Column, columns } from './columns';
import ExpandableRow from './ExpandableRow';

interface TableProps {
  data: Repo[];
  columns: Column[];
  onSelectRow: (repo: Repo) => void;
}

const DataTable = ({ data, onSelectRow }: TableProps) => {
  const options: MUIDataTableOptions = {
    filter: true,
    onFilterChange: (changedColumn, filterList) => {
      console.log('Filter change:', changedColumn, filterList);
    },
    selectableRows: 'multiple',
    filterType: 'dropdown' as FilterType,
    responsive: 'standard',
    pagination: false,
    rowsPerPage: 10,
    serverSide: true,
    expandableRows: true,
    textLabels: {
      selectedRows: {
        text: 'row(s) selected',
        delete: 'Delete',
        deleteAria: 'Delete Selected Rows',
      },
    },
    onRowSelectionChange: (
      _currentRowsSelected,
      _allRowsSelected,
      rowsSelected,
    ) => {
      if (!rowsSelected) return;

      rowsSelected.forEach((rowIndex: number) => {
        const selectedRepo = data[rowIndex];

        if (selectedRepo) {
          onSelectRow(selectedRepo);
        }
      });
    },
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
