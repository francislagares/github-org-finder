import { useCallback, useEffect, useState } from 'react';

import { GitHub } from '@mui/icons-material';
import { Alert, Box, Container, Stack, Typography } from '@mui/material';

import { columns } from '@/components/DataTable/columns';
import DataTable from '@/components/DataTable/DataTable';

import { GetReposUseCase } from '@/application/usecases/getRepos';
import { Repo } from '@/domain/entities/repo';
import { RepoService } from '@/infrastucture/repos/repos.service';

import CircularLoader from './components/Loader/CircularLoader';
import SearchBar from './components/SearchBar/SearchBar';

const repoRepository = new RepoService();
const getReposUseCase = new GetReposUseCase(repoRepository);

const Home = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');

  // Fetch data function
  const fetchRepos = useCallback(
    async (page: number, reset: boolean = false) => {
      if (!orgName) return;

      try {
        setError(null); // Reset error

        if (reset) setRepos([]); // Clear previous data for new search

        setLoading(reset); // Loading state for initial fetch
        setLoadingMore(!reset); // Loading state for infinite scroll

        const data = await getReposUseCase.execute({
          orgName,
          page,
          limit: 10,
        });

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setRepos(prevRepos => (reset ? data : [...prevRepos, ...data]));
        }
      } catch (err) {
        setError(
          'Error fetching repos: ' +
            (err instanceof Error ? err.message : 'Unknown error'),
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [orgName],
  );

  // Watch for orgName changes to trigger a new search
  useEffect(() => {
    if (orgName) {
      setPage(1); // Reset page
      setHasMore(true); // Reset infinite scroll
      fetchRepos(1, true); // Fetch new data and reset table
    } else {
      setRepos([]); // Clear table when orgName is empty
    }
  }, [orgName, fetchRepos]);

  // Handle infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loadingMore &&
        hasMore
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  // Fetch additional pages on page increment
  useEffect(() => {
    if (page > 1) {
      fetchRepos(page);
    }
  }, [page, fetchRepos]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack sx={{ textAlign: 'center' }}>
          <Box textAlign='center'>
            <GitHub sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant='h3' component='h1' gutterBottom>
              GitHub Repository Search
            </Typography>
          </Box>

          <SearchBar onSearch={setOrgName} />

          {error && (
            <Alert severity='error' sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
              {error}
            </Alert>
          )}

          {repos.length > 0 && <DataTable columns={columns} data={repos} />}

          {loading && (
            <Typography sx={{ marginTop: 5, textAlign: 'center' }}>
              Loading Content...
            </Typography>
          )}

          {loadingMore && <CircularLoader />}

          {!loading && !loadingMore && !hasMore && repos.length > 0 && (
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

          {!loading && !repos.length && orgName && (
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
