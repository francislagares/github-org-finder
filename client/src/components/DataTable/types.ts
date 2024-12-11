import { Repo } from '@/domain/entities/repo';

import { Column } from './columns';

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
