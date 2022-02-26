import {HttpClient} from '.';
import {List, ListDTO} from '../store/lists';

type GetListsResponse = {
  items: List[];
  toal: number;
};

class ListsClient extends HttpClient {
  public async getLists(): Promise<GetListsResponse> {
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
}

export default new ListsClient({
  // TODO load deafault values from env config - during build
  baseURL: 'http://192.168.0.201:3030',
});
