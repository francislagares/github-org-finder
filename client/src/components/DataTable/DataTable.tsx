import MUIDataTable, { FilterType, MUIDataTableOptions } from 'mui-datatables';

import { Repo } from '@/models/repo';

import ExpandableRow from './ExpandableRow';

interface TableProps {
  data: Repo[];
}

const columns = [
  {
    name: 'name',
    label: 'Name',
  },
  {
    name: 'url',
    label: 'URL',
  },
  {
    name: 'branches',
    label: 'Branches',
  },
  {
    name: 'language',
    label: 'Language',
  },
];

const DataTable = ({ data }: TableProps) => {
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
    expandableRows: true,
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
      options={options}
    />
  );
};

export default DataTable;
