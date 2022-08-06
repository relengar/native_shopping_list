import {HttpClient, PaginatedResponse} from '.';
import {User} from '../../types';

export interface UsersClientInterface {
  search(
    username: string,
    forListId: string,
    page?: number,
  ): Promise<PaginatedResponse<User>>;
}

export class UsersClient extends HttpClient implements UsersClientInterface {
  public async search(
    username: string,
    forListId: string,
    page: number = 1,
    limit: number = 4,
  ): Promise<PaginatedResponse<User>> {
    return this.request('/user', 'GET', null, {
      params: {
        username,
        forListId,
        page,
        limit,
        excludeShared: true,
      },
    });
  }
}
