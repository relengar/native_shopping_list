import {HttpClient, PaginatedResponse} from '.';
import {List, ListDTO, User} from '../../types';

export interface ListHttpClientInterface {
  getLists(): Promise<PaginatedResponse<List>>;
  createList(data: ListDTO, ownerId: string): Promise<List>;
  updateList(list: Partial<List> & {id: string}): Promise<List>;
  deleteList(id: string): Promise<void>;
  getSharees(id: string): Promise<User[]>;
  shareList(id: string, targetUserId: string): Promise<void>;
  removeSharing(id: string, targetUserId: string): Promise<void>;
}

export class ListsClient extends HttpClient {
  public async getLists(): Promise<PaginatedResponse<List>> {
    //   TODO pagination
    return await this.request('/shopping_list?page=1&limit=1000');
  }

  public async createList(data: ListDTO, ownerId: string): Promise<List> {
    return await this.request('/shopping_list', 'POST', {
      ...data,
      owner: ownerId,
    });
  }

  public async updateList(list: Partial<List> & {id: string}): Promise<List> {
    return await this.request(`/shopping_list/${list.id}`, 'PATCH', list);
  }

  public async deleteList(id: string): Promise<void> {
    return await this.request(`/shopping_list/${id}`, 'DELETE');
  }

  public async getSharees(id: string): Promise<User[]> {
    return await this.request(`/shopping_list/${id}/share`);
  }

  public async shareList(id: string, targetUserId: string): Promise<void> {
    return await this.request(`/shopping_list/${id}/share`, 'POST', {
      targetUserId,
    });
  }

  public async removeSharing(id: string, targetUserId: string): Promise<void> {
    return await this.request(`/shopping_list/${id}/share`, 'DELETE', {
      targetUserId,
    });
  }
}
