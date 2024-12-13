import { Repo } from '@/domain/entities/repo';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface ExpandableRowProps {
  branchesList: Repo['branchesList'];
}

const ExpandableRow = ({ branchesList = [] }: ExpandableRowProps) => {
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
};

export default ExpandableRow;
