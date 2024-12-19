export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface Repo {
  id: number;
  name: string;
  url: string;
  branches: number;
  branchesList: Branch[];
  language: string;
  isChecked: boolean;
}

export interface ReposFixture {
  repos: Repo[];
}
