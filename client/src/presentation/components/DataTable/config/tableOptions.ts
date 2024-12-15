import { FilterType, MUIDataTableOptions } from 'mui-datatables';

export const defaultTableOptions: MUIDataTableOptions = {
  filter: true,
  filterType: 'dropdown' as FilterType,
  responsive: 'standard',
  pagination: false, // Disabled since we're using infinite scroll
  rowsPerPage: 10,
  serverSide: false,
  expandableRows: true,
  selectableRows: 'multiple',
  sortFilterList: false, // Prevent automatic sorting of filter lists
  enableNestedDataAccess: '.', // Enable nested data access for complex objects
  textLabels: {
    selectedRows: {
      text: 'repo(s) saved ',
      delete: 'Delete',
      deleteAria: 'Delete Selected Repos',
    },
  },
  // Disable default sorting to maintain our custom sort order
  sort: false,
  sortOrder: {
    name: 'isChecked',
    direction: 'desc',
  },
};
