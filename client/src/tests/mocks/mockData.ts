import { Repo } from '@/domain/entities/repo';

export const mockRepos: Repo[] = [
  {
    id: 1,
    name: 'repo-1',
    url: 'https://github.com/org/repo-1',
    branches: 2,
    branchesList: [
      {
        name: 'main',
        commit: {
          sha: 'abc123',
          url: 'https://github.com/org/repo-1/commit/abc123',
        },
        protected: false,
      },
      {
        name: 'develop',
        commit: {
          sha: 'def456',
          url: 'https://github.com/org/repo-1/commit/def456',
        },
        protected: true,
      },
    ],
    language: 'TypeScript',
    isChecked: false,
  },
  {
    id: 2,
    name: 'repo-2',
    url: 'https://github.com/org/repo-2',
    branches: 1,
    branchesList: [
      {
        name: 'main',
        commit: {
          sha: 'ghi789',
          url: 'https://github.com/org/repo-2/commit/ghi789',
        },
        protected: false,
      },
    ],
    language: 'JavaScript',
    isChecked: false,
  },
];
