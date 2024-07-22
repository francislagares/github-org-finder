import { useMemo, useState } from 'react';

import DataTable from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';

import useRepos from '@/hooks/useRepos';

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
