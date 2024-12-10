import { useCallback, useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import DataTable from '@/components/DataTable';
import { columns } from '@/components/DataTable/columns';

import { GetReposUseCase } from '@/application/usecases/getRepos';
import { Repo } from '@/domain/entities/repo';
import { RepoService } from '@/infrastucture/repos/repos.service';

import CircularLoader from './components/Loader/CircularLoader';

const repoRepository = new RepoService();
const getReposUseCase = new GetReposUseCase(repoRepository);

const Home = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(
    async (page: number) => {
      try {
        setLoadingMore(true);
        const data = await getReposUseCase.execute({
          orgName: 'adobe',
          page,
          limit: 10,
        });

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setRepos(prevRepos => [...prevRepos, ...data]);
        }
      } catch (err) {
        setError(
          'Error fetching repos: ' +
            (err instanceof Error ? err.message : 'Unknown error'),
        );
      } finally {
        setLoadingMore(false);
      }
    },
    [setRepos],
  );

  useEffect(() => {
    setLoading(true);
    fetchRepos(page).finally(() => setLoading(false));
  }, []);

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

  useEffect(() => {
    if (page > 1) {
      fetchRepos(page);
    }
  }, [page, fetchRepos]);

  if (loading)
    return (
      <Typography
        variant='h5'
        component='p'
        sx={{ m: 10, textAlign: 'center' }}
      >
        Loading Content...
      </Typography>
    );
  if (error)
    return (
      <Box sx={{ m: 10, textAlign: 'center' }}>
        <Typography variant='subtitle1' gutterBottom>
          Something went wrong:
        </Typography>
        <Typography variant='subtitle2' gutterBottom>
          {error}
        </Typography>
      </Box>
    );

  return (
    <main>
      <Typography
        variant='h3'
        component='h1'
        sx={{ m: 10, textAlign: 'center' }}
      >
        GitHub Repository Search Tool
      </Typography>
      {repos.length > 0 && <DataTable columns={columns} data={repos} />}
      {loadingMore && <CircularLoader />}
    </main>
  );
};

export default Home;
