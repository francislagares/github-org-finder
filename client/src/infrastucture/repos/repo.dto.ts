import { Branch } from '@/domain/entities/branch';

export interface RepoDto {
  id: number;
  name: string;
  url: string;
  branches: number;
  branchesList?: Branch[];
  language: string;
  isChecked: boolean;
}
