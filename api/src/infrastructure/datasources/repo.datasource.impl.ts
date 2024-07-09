import { RepoModel } from '@/data/mongodb/models/repo.model';
import { CustomError, Repo, RepoDatasource, RepoDto } from '@/domain';

import { RepoMapper } from '../mappers/repo.mapper';

export class RepoDatasourceImpl implements RepoDatasource {
  private mapper = new RepoMapper();

  public async saveRepo(repoDto: RepoDto): Promise<Repo> {
    const { name, url, branches, language, isChecked } = repoDto;
    try {
      const repoExists = await RepoModel.findOne();

      if (repoExists) throw CustomError.badRequest('Repo already exists.');

      const repo = await RepoModel.create({
        name,
        url,
        branches,
        language,
        isChecked,
      });

      await repo.save();

      return this.mapper.toDomain({
        id: repo.id,
        name: repo.name,
        url: repo.url,
        branches: repo.branches,
        language: repo.language,
        isChecked: repo.isChecked,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
