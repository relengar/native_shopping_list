import {HttpClient} from '.';
import {Item, ItemDTO} from '../../types';

export interface ItemsClientInterface {
  getListItems(listId: string): Promise<Item[]>;
  updateItem(listId: string, item: Partial<Item> & {id: string}): Promise<any>;
  createItems(listId: string, items: ItemDTO[]): Promise<any>;
  deleteItem(listId: string, itemId: string): Promise<any>;
}

export class ItemsClient extends HttpClient implements ItemsClientInterface {
  public async getListItems(listId: string): Promise<Item[]> {
    return await this.request<Item[]>(`/shopping_list/${listId}/item`);
  }

  public async updateItem(listId: string, item: Partial<Item> & {id: string}) {
    return await this.request<Item[]>(
      `/shopping_list/${listId}/item/${item.id}`,
      'PATCH',
      item,
    );
  }

  public async createItems(listId: string, items: ItemDTO[]) {
    return await this.request(`/shopping_list/${listId}/item`, 'POST', items);
  }

  public async deleteItem(listId: string, itemId: string) {
    return this.request(`/shopping_list/${listId}/item/${itemId}`, 'DELETE');
  }
}
