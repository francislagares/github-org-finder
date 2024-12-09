import { Repo } from '@/domain/entities/repo';

import { columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<Repo[]> {
  // Fetch data from your API here.
  return [
    {
      id: 9534479,
      name: 'developer.github.com',
      url: 'https://api.github.com/repos/google/developer.github.com',
      branches: 10,
      language: 'Ruby',
    },
    {
      id: 9534479,
      name: 'developer.github.com',
      url: 'https://api.github.com/repos/google/developer.github.com',
      branches: 10,
      language: 'Ruby',
    },
    {
      id: 9534479,
      name: 'developer.github.com',
      url: 'https://api.github.com/repos/google/developer.github.com',
      branches: 10,
      language: 'Ruby',
    },
    {
      id: 9534479,
      name: 'developer.github.com',
      url: 'https://api.github.com/repos/google/developer.github.com',
      branches: 10,
      language: 'Ruby',
    },
    {
      id: 9534479,
      name: 'developer.github.com',
      url: 'https://api.github.com/repos/google/developer.github.com',
      branches: 10,
      language: 'Ruby',
    },
  ];
}

const Repos = async () => {
  const data = await getData();
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Repos;
