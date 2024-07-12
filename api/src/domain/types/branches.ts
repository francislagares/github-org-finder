export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export type BranchesList = { branches: Branch[]; totalCount: number };
