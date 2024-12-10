export interface Column {
  name: string;
  label: string;
}

export const columns: Column[] = [
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
