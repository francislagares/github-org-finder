import { FilterType, MUIDataTableOptions } from 'mui-datatables';

export const defaultTableOptions: MUIDataTableOptions = {
  filter: true,
  filterType: 'dropdown' as FilterType,
  responsive: 'standard',
  pagination: false,
  rowsPerPage: 10,
  serverSide: true,
  expandableRows: true,
  selectableRows: 'multiple',
  textLabels: {
    selectedRows: {
      text: 'row(s) selected',
      delete: 'Delete',
      deleteAria: 'Delete Selected Rows',
    },
  },
};
