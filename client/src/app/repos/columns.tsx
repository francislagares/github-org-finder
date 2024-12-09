'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Repo } from '@/domain/entities/repo';

export const columns: ColumnDef<Repo>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'branches',
    header: 'Branches',
  },
  {
    accessorKey: 'language',
    header: 'Language',
  },
];
