import { Repo } from '@/domain/entities/repo';
import { GitHub } from '@mui/icons-material';
import { Alert, Box, Container, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { useDeleteRepo } from '@/application/mutations/useDeleteRepo';
import { useSaveRepo } from '@/application/mutations/useSaveRepo';
import useRepos from '@/application/queries/useRepos';
import { columns } from '@/presentation/components/DataTable/columns';
import DataTable from '@/presentation/components/DataTable/DataTable';
import { sortReposByCheckedStatus } from '@/presentation/components/DataTable/utils/sortUtils';
import CircularLoader from '@/presentation/components/Loader/CircularLoader';
import SearchBar from '@/presentation/components/SearchBar/SearchBar';

import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [orgName, setOrgName] = useState('');
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useRepos(orgName);

  // Combine and sort all pages of data
  const sortedRepos = useMemo(() => {
    const allRepos = data?.pages.flat() || [];
    const { uniqueCheckedRepos, uniqueUncheckedRepos } =
      sortReposByCheckedStatus(allRepos);

    return [...uniqueCheckedRepos, ...uniqueUncheckedRepos];
  }, [data?.pages]);

  const mutationPost = useSaveRepo();
  const mutationDelete = useDeleteRepo();

  const handleSelectRepo = async (selectedRepo: Repo) => {
    const updatedPages = data?.pages.map(page =>
      page.map(repo =>
        repo.id === selectedRepo.id
          ? { ...repo, isChecked: selectedRepo.isChecked }
          : repo,
      ),
    );

    if (data?.pages && updatedPages) {
      data.pages = updatedPages;
    }

    if (selectedRepo.isChecked) {
      await mutationPost.mutateAsync(selectedRepo);
    } else {
      await mutationDelete.mutateAsync(selectedRepo);
    }
  };

  const handleDeleteRow = async (selectedRepo: Repo) => {
    await mutationDelete.mutateAsync(selectedRepo);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack>
          <Box textAlign="center">
            <GitHub sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              GitHub Repository Search
            </Typography>
          </Box>

          <SearchBar onSearch={setOrgName} />

          {error && (
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
              {`Error fetching repos: ${error instanceof Error ? error.message : 'Unknown error'}`}
            </Alert>
          )}

          {sortedRepos.length > 0 && (
            <DataTable
              columns={columns}
              data={sortedRepos}
              onSelectRow={handleSelectRepo}
              onDeleteRow={handleDeleteRow}
            />
          )}

          {isLoading && (
            <Typography sx={{ marginTop: 5, textAlign: 'center' }}>
              Loading Content...
            </Typography>
          )}

          {isFetchingNextPage && <CircularLoader />}

          {!isLoading &&
            !isFetchingNextPage &&
            !hasNextPage &&
            sortedRepos.length > 0 && (
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

          {!isLoading && !sortedRepos.length && orgName && (
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
              No repositories found for "{orgName}". Try searching for a
              different organization.
            </Alert>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
