'use client';
import { useEffect, useState } from 'react';

import { fetchReposByOrgName } from '@/infrastucture/repos/repos.api';

const Home = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRepos = async () => {
      setLoading(true);
      try {
        const orgName = 'adobe';
        const repos = await fetchReposByOrgName(orgName, 1, 10);
        setRepos(repos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getRepos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Lista de Repositorios</h1>
      <ul>
        {repos?.map(repo => (
          <li key={repo.id}>
            <h2>{repo.name}</h2>
            <p>{repo.description}</p>
            <p>Branches: {repo.branches}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
