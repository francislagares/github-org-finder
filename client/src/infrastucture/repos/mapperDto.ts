import { Repo } from '@/domain/entities/repo';

import { RepoDto } from './repo.dto';

export function dtoToRepo(dto: RepoDto): Repo {
  return {
    id: dto.id,
    name: dto.name,
    url: dto.url,
    branches: dto.branches,
    language: dto.language,
  };
}
