import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MUIDataTable, { FilterType, MUIDataTableOptions } from 'mui-datatables';

import { Repo } from '@/models/repo';

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
    rowsPerPage: 10,
    expandableRows: true,
    renderExpandableRow: (_rowData, rowMeta) => {
      const branchesList = data[rowMeta.rowIndex]?.branchesList;
      return (
        <TableRow>
          <TableCell colSpan={6}>
            <TableContainer component={Paper}>
              <Table style={{ minWidth: 750 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Branch Name</TableCell>
                    <TableCell align="center">Commit SHA</TableCell>
                    <TableCell align="center">Commit URL</TableCell>
                    <TableCell align="center">Protected</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {branchesList?.map(branch => (
                    <TableRow key={branch.name}>
                      <TableCell component="th" scope="row">
                        {branch.name}
                      </TableCell>
                      <TableCell align="center">{branch.commit.sha}</TableCell>
                      <TableCell align="center">
                        <a
                          href={branch.commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {branch.commit.url}
                        </a>
                      </TableCell>
                      <TableCell align="center">
                        {branch.protected.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableCell>
        </TableRow>
      );
    },
  };

  return (
    <MUIDataTable
      title="Repositories"
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default DataTable;
