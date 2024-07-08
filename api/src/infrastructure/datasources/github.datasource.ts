import axios from 'axios';

import { serverSchema } from '@/config/environment';

import { CustomError, RepoDatasource } from '@/domain';
import { Repo } from '@/domain/entities/repo';

export class GithubApiDatasource implements RepoDatasource {
  public async fetchByOrgName(orgName: string): Promise<Repo[]> {
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
}
