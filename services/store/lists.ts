import {ResultSet} from 'react-native-sqlite-storage';
import {getRowsFromDbResponse, multiInsertStatement} from '.';
import {StoreModel} from './storeModel';
import listClient from '../http/lists';
import connection from '../http/connectivity';

export type List = {
  id: string;
  title: string;
  description: string;
  owner: string;
};

export type ListDTO = Omit<List, 'id' | 'owner'>;

export interface ListsStorageInterface {
  setAllLists(lists: List[]): Promise<void>;
  addList(list: List): Promise<void>;
  updateList(data: Partial<List>): Promise<List>;
  deleteList(id: string): Promise<void>;
  getLists(): Promise<List[]>;
}

class ListsStorage extends StoreModel<List> implements ListsStorageInterface {
  protected serialize(list: List): string[] {
    return [list.id, list.title, list.description, list.owner];
  }
  protected deserialize(dbResults: [ResultSet]): List[] {
    const rows = getRowsFromDbResponse(dbResults);

    return rows.map<List>(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      owner: row.owner,
    }));
  }
  public async setAllLists(lists: List[]): Promise<void> {
    if (!lists.length) {
      return;
    }
    const db = await this.getDb();
    const {sql, params} = multiInsertStatement(lists.map(this.serialize));
    await db.transaction(async tx => {
      tx.executeSql('DELETE FROM lists');
      tx.executeSql(
        `INSERT INTO lists(id, title, description, owner) VALUES${sql}`,
        params,
      );
    });
  }

  public async addList(list: List): Promise<void> {
    const db = await this.getDb();
    await db.executeSql(
      'INSERT INTO lists(id, title, description, owner) VALUES(:1, :2, :3, :4)',
      [list.id, list.title, list.description, list.owner],
    );
  }

  public async updateList(data: Partial<List> & {id: string}): Promise<List> {
    const db = await this.getDb();
    const [result] = await db.executeSql('SELECT * FROM lists WHERE id = :1', [
      data.id,
    ]);

    const item: List | null = result.rows.length ? result.rows.item(0) : null;
    if (!item) {
      throw new Error('List not found');
    }
    const newItem: List = {...item, ...data};

    await db.executeSql(
      'UPDATE lists SET title = :2, description = :3 WHERE id = :1',
      [newItem.id, newItem.title, newItem.description],
    );

    if (connection.connected) {
      await listClient.updateList(newItem);
    }

    return newItem;
  }

  public async deleteList(id: string): Promise<void> {
    const db = await this.getDb();
    await db.executeSql('DELETE FROM lists WHERE id = :1', [id]);
  }

  public async getLists(): Promise<List[]> {
    const db = await this.getDb();
    const results = await db.executeSql('SELECT * FROM lists');
    return this.deserialize(results);
  }
}

export default new ListsStorage();
