import { useMemo, useState } from 'react';

import useRepos from '@/hooks/useRepos';

import { DataTable, SearchBar } from '@/components';

import './App.css';

const App = () => {
  const [orgName, setOrgName] = useState('');
  const { data } = useRepos(orgName);

  const repos = useMemo(() => {
    if (data?.pages) {
      // Extract and flatten repos arrays from each page
      return data.pages.flatMap(page => page.repos || []);
    }
    return [];
  }, [data]);

  return (
    <div>
      <SearchBar onSearch={setOrgName} />
      <DataTable data={repos} />
    </div>
  );
};

export default App;
