import axios from 'axios';

import { serverSchema } from '@/config/environment';

import { CustomError, RepoDto } from '@/domain';
import { Repo } from '@/domain/entities/repo';
import { Branch, BranchesList } from '@/domain/types/branches';
import { GithubApiInterface, RepoMapper } from '@/infrastructure/';

export class GithubApiDatasourceImpl implements GithubApiInterface {
  private mapper = new RepoMapper();

  private async getBranches(
    orgName: string,
    repoName: string,
  ): Promise<BranchesList> {
    const response = await axios.get(
      `${serverSchema.GITHUB_API_URL}/repos/${orgName}/${repoName}/branches`,
      {
        headers: {
          Authorization: `token ${serverSchema.GITHUB_SECRET}`,
        },
        params: {
          per_page: 10,
        },
      },
    );
    const branches: Branch[] = response.data.map((branch: Branch) => branch);
    const totalCount = response.headers['x-total-count']
      ? parseInt(response.headers['x-total-count'], 10)
      : branches.length;

    return { branches, totalCount };
  }

  public async fetchByOrgName(
    orgName: string,
    pageNum: number,
    limit: number,
  ): Promise<Repo[]> {
    try {
      const response = await axios.get<Repo[]>(
        `${serverSchema.GITHUB_API_URL}/orgs/${orgName}/repos`,
        {
          headers: {
            Authorization: `token ${serverSchema.GITHUB_SECRET}`,
          },
          params: {
            per_page: limit,
            page: pageNum,
          },
        },
      );

      const reposData = response.data;
      const repos = await Promise.all(
        reposData.map(async (repoDto: RepoDto) => {
          const { branches, totalCount } = await this.getBranches(
            orgName,
            repoDto.name,
          );
          const repo = this.mapper.toDTO({
            ...repoDto,
            branches: totalCount, // Include the total count of branches
            branchesList: branches, // Include the first 10 branches
          });

          return repo;
        }),
      );

      return repos;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
