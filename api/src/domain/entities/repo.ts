import { Branch } from '@/domain/types/branches';

export class Repo {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly url: string,
    public readonly branches: number,
    public readonly branchesList: Branch[],
    public readonly language: string,
    public readonly isChecked: boolean = false,
  ) {}
}
