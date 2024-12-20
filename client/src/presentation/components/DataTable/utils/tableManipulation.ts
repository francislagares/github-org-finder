interface TableRowOperations {
  removeRow: (row: HTMLElement) => Promise<void>;
  updateRowIndices: (tbody: HTMLElement, startIndex: number) => void;
  getVisibleRows: (tbody: HTMLElement) => HTMLElement[];
}

export const tableOperations: TableRowOperations = {
  removeRow: async (row: HTMLElement): Promise<void> => {
    return new Promise(resolve => {
      row.style.transition = 'opacity 0.3s ease-out';
      row.style.opacity = '0';

      setTimeout(() => {
        row.remove();
        resolve();
      }, 300);
    });
  },

  updateRowIndices: (tbody: HTMLElement, startIndex: number): void => {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, idx) => {
      if (idx >= startIndex) {
        const newIndex = idx;
        row.setAttribute('data-index', newIndex.toString());

        // Update any data attributes or event listeners if needed
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.setAttribute('data-index', newIndex.toString());
        }
      }
    });
  },

  getVisibleRows: (tbody: HTMLElement): HTMLElement[] => {
    return Array.from(tbody.querySelectorAll('tr')).filter(
      row => row.style.opacity !== '0',
    );
  },
};
