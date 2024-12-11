import { useEffect, useState } from 'react';

import { GitHub } from '@mui/icons-material';
import { Alert, Box, Container, Stack, Typography } from '@mui/material';

import { columns } from '@/components/DataTable/columns';
import DataTable from '@/components/DataTable/DataTable';

import CircularLoader from './components/Loader/CircularLoader';
import SearchBar from './components/SearchBar/SearchBar';
import { Repo } from './domain/entities/repo';
import useRepos from './hooks/useRepos';
import { useSaveRepo } from './hooks/useSaveRepo';

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

  const repos = data?.pages.flat() || [];

  const mutation = useSaveRepo();

  const handleSelectRepo = (selectedRepo: Repo) => {
    mutation.mutate(selectedRepo);
  };

  /* const repoService = new RepoService();
  const saveRepoUseCase = new SaveRepoUseCase(repoService);

  const handleSelectRepo = async (selectedRepo: Repo) => {
    try {
      await saveRepoUseCase.execute({ repo: selectedRepo });

      console.log('Successfully saved repository:', selectedRepo);
    } catch (error) {
      console.error('Error saving repo:', error);
    }
  }; */

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
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack>
          <Box textAlign='center'>
            <GitHub sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant='h3' component='h1' gutterBottom>
              GitHub Repository Search
            </Typography>
          </Box>

          <SearchBar onSearch={setOrgName} />

          {/* Error alert */}
          {error && (
            <Alert severity='error' sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
              {`Error fetching repos: ${error instanceof Error ? error.message : 'Unknown error'}`}
            </Alert>
          )}

          {/* Data table */}
          {repos.length > 0 && (
            <DataTable
              columns={columns}
              data={repos}
              onSelectRow={handleSelectRepo}
            />
          )}

          {/* Initial loading state */}
          {isLoading && (
            <Typography sx={{ marginTop: 5, textAlign: 'center' }}>
              Loading Content...
            </Typography>
          )}

          {/* Loading more data */}
          {isFetchingNextPage && <CircularLoader />}

          {/* No more data */}
          {!isLoading &&
            !isFetchingNextPage &&
            !hasNextPage &&
            repos.length > 0 && (
              <Alert
                severity='info'
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

          {/* No results */}
          {!isLoading && !repos.length && orgName && (
            <Alert
              severity='info'
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
