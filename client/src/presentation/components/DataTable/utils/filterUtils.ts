import { Repo } from '@/domain/entities/repo';

export const filterUtils = {
  matchesSearch: (repo: Repo, searchTerm: string): boolean => {
    if (!searchTerm) return true;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const normalizedName = repo.name.toLowerCase();

    return normalizedName.includes(normalizedSearch);
  },

  getRowsToRemove: (
    tbody: HTMLElement,
    data: Repo[],
    searchTerm: string,
  ): HTMLElement[] => {
    return Array.from(tbody.querySelectorAll('tr')).filter((row, index) => {
      const repo = data[index];
      return repo && !filterUtils.matchesSearch(repo, searchTerm);
    });
  },
};
