import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { columns } from '@/presentation/components/DataTable/columns';
import DataTable from '@/presentation/components/DataTable/DataTable';

import { mockRepos } from '../mocks/mockData';

describe('DataTable Integration', () => {
  const mockOnSelectRow = vi.fn();
  const mockOnDeleteRow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table with correct columns and data', () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      // Verify column headers
      columns.forEach(column => {
        expect(screen.getByText(column.label)).toBeInTheDocument();
      });

      // Verify data rows
      mockRepos.forEach(repo => {
        expect(screen.getByText(repo.name)).toBeInTheDocument();
        expect(screen.getByText(repo.language)).toBeInTheDocument();
      });
    });

    it('should handle empty data state', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      expect(screen.getByRole('alert')).toHaveTextContent(
        /no repositories found/i,
      );
    });
  });

  describe('Row Selection', () => {
    it('should handle single row selection', async () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const checkbox = screen.getAllByRole('checkbox')[1]; // First row checkbox
      await userEvent.click(checkbox);

      expect(mockOnSelectRow).toHaveBeenCalledWith({
        ...mockRepos[0],
        isChecked: true,
      });
      expect(checkbox).toBeChecked();
    });

    it('should handle multiple row selection', async () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const checkboxes = screen.getAllByRole('checkbox').slice(1, 3); // First two row checkboxes
      await userEvent.click(checkboxes[0]);
      await userEvent.click(checkboxes[1]);

      expect(mockOnSelectRow).toHaveBeenCalledTimes(2);
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('Row Expansion', () => {
    it('should expand row and show branch details', async () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const expandButton = screen.getAllByRole('button')[1];
      await userEvent.click(expandButton);

      waitFor(() => {
        expect(screen.getByText('Branch Name')).toBeInTheDocument();
        expect(screen.getByText('Commit SHA')).toBeInTheDocument();

        mockRepos[0].branchesList?.forEach(branch => {
          expect(screen.getByText(branch.name)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Row Deletion', () => {
    it('should handle row deletion', async () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      // Select and delete first row
      const checkbox = screen.getAllByRole('checkbox')[1];
      await userEvent.click(checkbox);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await userEvent.click(deleteButton);

      expect(mockOnDeleteRow).toHaveBeenCalledWith(mockRepos[0]);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getAllByRole('row').length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', async () => {
      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const firstCheckbox = screen.getAllByRole('checkbox')[1];

      firstCheckbox.focus();
      expect(document.activeElement).toBe(firstCheckbox);

      await userEvent.keyboard('{space}');

      waitFor(() => {
        expect(mockOnSelectRow).toHaveBeenCalledWith({
          ...mockRepos[0],
          isChecked: true,
        });
        expect(firstCheckbox).toBeChecked();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle selection errors gracefully', async () => {
      mockOnSelectRow.mockRejectedValueOnce(new Error('Selection failed'));

      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const checkbox = screen.getAllByRole('checkbox')[1];
      await userEvent.click(checkbox);

      waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
      });
    });

    it('should handle deletion errors gracefully', async () => {
      mockOnDeleteRow.mockRejectedValueOnce(new Error('Deletion failed'));

      render(
        <DataTable
          data={mockRepos}
          columns={columns}
          onSelectRow={mockOnSelectRow}
          onDeleteRow={mockOnDeleteRow}
        />,
      );

      const checkbox = screen.getAllByRole('checkbox')[1];
      await userEvent.click(checkbox);
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await userEvent.click(deleteButton);

      waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
      });
    });
  });
});
