import axios from 'axios';

import { serverSchema } from '@/config/environment';

import { CustomError, RepoDto } from '@/domain';
import { Repo } from '@/domain/entities/repo';
import { GithubApiInterface, RepoMapper } from '@/infrastructure/';

export class GithubApiDatasourceImpl implements GithubApiInterface {
  private mapper = new RepoMapper();

  private async getBranchesCount(
    orgName: string,
    repoName: string,
  ): Promise<number> {
    const response = await axios.get(
      `${serverSchema.GITHUB_API_URL}/repos/${orgName}/${repoName}/branches`,
      {
        headers: {
          Authorization: `token ${serverSchema.GITHUB_SECRET}`,
        },
      },
    );
    return response.data.length;
  }

  public async fetchByOrgName(
    orgName: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<Repo[]> {
    try {
      const response = await axios.get<RepoDto[]>(
        `${serverSchema.GITHUB_API_URL}/orgs/${orgName}/repos`,
        {
          headers: {
            Authorization: `token ${serverSchema.GITHUB_SECRET}`,
          },
          params: {
            page,
            per_page: perPage,
          },
        },
      );

      const reposData = response.data;
      const repos = reposData.map(async (repoDto: RepoDto) => {
        const branchesCount = await this.getBranchesCount(
          orgName,
          repoDto.name,
        );
        return this.mapper.toDTO({
          ...repoDto,
          branches: branchesCount,
        });
      });

      return Promise.all(repos);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
