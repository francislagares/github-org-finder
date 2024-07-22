import { Branch } from './branch';

export interface Repo {
  id: number;
  name: string;
  url: string;
  branches: number;
  branchesList: Branch[];
  language: string;
  isChecked: boolean;
}
