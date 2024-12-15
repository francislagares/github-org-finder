import { Repo } from '@/domain/entities/repo';
import { Alert } from '@mui/material';

import { columns } from '@/presentation/components/DataTable/columns';
import DataTable from '@/presentation/components/DataTable/DataTable';
import CircularLoader from '@/presentation/components/Loader/CircularLoader';

interface RepoListProps {
  repos: Repo[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  orgName: string;
  onSelectRepo: (repo: Repo) => Promise<void>;
  onDeleteRepo: (repo: Repo) => Promise<void>;
}

const RepoList = ({
  repos,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  orgName,
  onSelectRepo,
  onDeleteRepo,
}: RepoListProps) => {
  if (isLoading) {
    return (
      <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
        Loading Content...
      </Alert>
    );
  }

  if (!repos.length && orgName) {
    return (
      <Alert
        severity="info"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          border: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        No repositories found for "{orgName}". Try searching for a different
        organization.
      </Alert>
    );
  }

  return (
    <>
      {repos.length > 0 && (
        <DataTable
          columns={columns}
          data={repos}
          onSelectRow={onSelectRepo}
          onDeleteRow={onDeleteRepo}
        />
      )}

      {isFetchingNextPage && <CircularLoader />}

      {!isLoading &&
        !isFetchingNextPage &&
        !hasNextPage &&
        repos.length > 0 && (
          <Alert
            severity="info"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mt: 4,
              border: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            No more repositories to load.
          </Alert>
        )}
    </>
  );
};

export default RepoList;
