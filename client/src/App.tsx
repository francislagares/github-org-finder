import { Repo } from '@/domain/entities/repo';
import { Alert, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { useDeleteRepo } from '@/application/mutations/useDeleteRepo';
import { useSaveRepo } from '@/application/mutations/useSaveRepo';
import useRepos from '@/application/queries/useRepos';
import { sortReposByCheckedStatus } from '@/presentation/components/DataTable/utils/sortUtils';
import Header from '@/presentation/components/Header/Header';
import Layout from '@/presentation/components/Layout/Layout';
import RepoList from '@/presentation/components/RepoList/RepoList';
import SearchBar from '@/presentation/components/SearchBar/SearchBar';
import { useInfiniteScroll } from '@/presentation/hooks/useInfiniteScroll';

import { ERROR_MESSAGES } from './constants';

const App = () => {
  const [orgName, setOrgName] = useState('');
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useRepos(orgName);

  // Set up infinite scrolling
  useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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

  return (
    <Layout>
      <Stack>
        <Header />
        <SearchBar onSearch={setOrgName} />

        {error && (
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
            {ERROR_MESSAGES.FETCH_ERROR}: $
            {error instanceof Error
              ? error.message
              : ERROR_MESSAGES.UNEXPECTED_ERROR}
          </Alert>
        )}

        <RepoList
          repos={sortedRepos}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          orgName={orgName}
          onSelectRepo={handleSelectRepo}
          onDeleteRepo={handleDeleteRow}
        />
      </Stack>
    </Layout>
  );
};

export default App;
