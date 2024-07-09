import { Repo, RepoDto } from '@/domain';

interface Mapper<T, U> {
  toDomain(dto: T): U;
  toDTO(domain: U): T;
}

export class RepoMapper implements Mapper<RepoDto, Repo> {
  public toDomain(dto: RepoDto): Repo {
    return new Repo(
      dto.id,
      dto.name,
      dto.url,
      dto.branches,
      dto.language,
      dto.isChecked,
    );
  }

  public toDTO(domain: Repo): RepoDto {
    return new RepoDto(
      domain.id,
      domain.name,
      domain.url,
      domain.branches,
      domain.language,
      domain.isChecked,
    );
  }
}
