import axios from 'axios';

import { serverSchema } from '@/config/environment';

import { CustomError, RepoDto } from '@/domain';
import { Repo } from '@/domain/entities/repo';
import { GithubApiInterface, RepoMapper } from '@/infrastructure/';

export class GithubApiDatasource implements GithubApiInterface {
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

      const reposData = response.data;
      const repos = reposData.map(async (repoDto: RepoDto) => {
        const branchesCount = await this.getBranchesCount(
          orgName,
          repoDto.name,
        );
        const repo = this.mapper.toDomain({
          ...repoDto,
          branches: branchesCount,
        });
        return repo;
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
