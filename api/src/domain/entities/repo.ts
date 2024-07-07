export class Repo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly url: string,
    public readonly branches: number,
    public readonly isChecked: boolean,
  ) {}
}
