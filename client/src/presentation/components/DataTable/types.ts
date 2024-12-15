import { Repo } from '@/domain/entities/repo';
import { MUIDataTableOptions } from 'mui-datatables';

import { Column } from './columns';

export type DataTableOptions = Omit<
  MUIDataTableOptions,
  'onRowSelectionChange'
> & {
  onRowSelectionChange?: (
    currentRowsSelected: RowSelectionInfo[],
    allRowsSelected: RowSelectionInfo[],
    rowsSelected: number[],
  ) => void;
  count?: number;
  serverSide?: boolean;
};

export interface RowSelectionInfo {
  index: number;
  dataIndex: number;
}

export interface TableProps {
  data: Repo[];
  columns: Column[];
  onSelectRow: (repo: Repo) => void;
  onDeleteRow: (repo: Repo) => void;
}

export interface DeletedRows {
  data: Array<{ dataIndex: number }>;
  lookup: { [key: number]: boolean };
}
