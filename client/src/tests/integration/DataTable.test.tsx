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

  it('should render table with data', () => {
    render(
      <DataTable
        data={mockRepos}
        columns={columns}
        onSelectRow={mockOnSelectRow}
        onDeleteRow={mockOnDeleteRow}
      />,
    );

    // Verify table title
    expect(screen.getByText('List of Repositories')).toBeInTheDocument();

    // Verify column headers
    columns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });

    // Verify data rows
    mockRepos.forEach(repo => {
      expect(screen.getByText(repo.name)).toBeInTheDocument();
    });
  });

  it('should handle single row selection', async () => {
    render(
      <DataTable
        data={mockRepos}
        columns={columns}
        onSelectRow={mockOnSelectRow}
        onDeleteRow={mockOnDeleteRow}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: new RegExp(mockRepos[0].name, 'i'),
    });

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnSelectRow).toHaveBeenCalledWith({
        ...mockRepos[0],
        isChecked: true,
      });
    });
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

    // Select first row
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: new RegExp(mockRepos[0].name, 'i'),
      }),
    );

    // Select second row
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: new RegExp(mockRepos[1].name, 'i'),
      }),
    );

    await waitFor(() => {
      expect(mockOnSelectRow).toHaveBeenCalledTimes(2);
      expect(mockOnSelectRow).toHaveBeenNthCalledWith(1, {
        ...mockRepos[0],
        isChecked: true,
      });
      expect(mockOnSelectRow).toHaveBeenNthCalledWith(2, {
        ...mockRepos[1],
        isChecked: true,
      });
    });
  });

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
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: new RegExp(mockRepos[0].name, 'i'),
      }),
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDeleteRow).toHaveBeenCalledWith(mockRepos[0]);
    });
  });

  it('should prevent selecting already deleted rows', async () => {
    const { rerender } = render(
      <DataTable
        data={mockRepos}
        columns={columns}
        onSelectRow={mockOnSelectRow}
        onDeleteRow={mockOnDeleteRow}
      />,
    );

    // Delete first row
    await userEvent.click(
      screen.getByRole('checkbox', {
        name: new RegExp(mockRepos[0].name, 'i'),
      }),
    );
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Update data to reflect deletion
    const updatedData = mockRepos.slice(1);
    rerender(
      <DataTable
        data={updatedData}
        columns={columns}
        onSelectRow={mockOnSelectRow}
        onDeleteRow={mockOnDeleteRow}
      />,
    );

    // Verify deleted row is not present
    expect(screen.queryByText(mockRepos[0].name)).not.toBeInTheDocument();
  });
});
