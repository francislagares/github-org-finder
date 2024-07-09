import axios from 'axios';

import { serverSchema } from '@/config/environment';

import { RepoModel } from '@/data/mongodb/models/repo.model';
import { CustomError, Repo, RepoDatasource, RepoDto } from '@/domain';

export class RepoDatasourceImpl implements RepoDatasource {
  async fetchByOrgName(orgName: string): Promise<Repo[]> {
    try {
      const response = await axios.get<Repo[]>(
        `${serverSchema.GITHUB_API_URL}/orgs/${orgName}/repos`,
        {
          headers: {
            Authorization: `token ${serverSchema.GITHUB_SECRET}`,
          },
          params: {
            per_page: 10,
          },
        },
      );

      const repos = response.data;

      return repos;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async save(repoDto: RepoDto): Promise<Repo> {
    const { id, name, url, branches, language, isChecked } = repoDto;
    try {
      const repoExists = await RepoModel.findById(id);

      if (repoExists) throw CustomError.badRequest('Repo already exists.');

      const repo = await RepoModel.create({
        name,
        url,
        branches,
        language,
        isChecked,
      });

      await repo.save();

      return new Repo(repo.id, name, url, branches, language, isChecked);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
