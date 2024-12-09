'use client';
import { useEffect, useState } from 'react';

import { DataTable } from '@/features/repos/components/DataTable';
import { columns } from '@/features/repos/components/DataTable/columns';

import { GetReposUseCase } from '@/application/usecases/getRepos';
import { Repo } from '@/domain/entities/repo';
import { RepoService } from '@/infrastucture/repos/repos.service';

const repoRepository = new RepoService();
const getReposUseCase = new GetReposUseCase(repoRepository);

const Home = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const data = await getReposUseCase.execute({
          orgName: 'adobe',
          page: 1,
          limit: 10,
        });
        setRepos(data);
      } catch (err) {
        setError(
          'Error fetching repos: ' +
            (err instanceof Error ? err.message : 'Unknown error'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={repos} />
    </div>
  );
};

export default Home;
