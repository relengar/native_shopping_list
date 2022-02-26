import {ResultSet} from 'react-native-sqlite-storage';
import {getRowsFromDbResponse} from '.';
import {StoreModel} from './storeModel';

type CurrentUser = {
  id: string;
  token: string;
  username: string;
};

export interface AuthStorageInterface extends StoreModel<CurrentUser> {
  getCurrentUser(): Promise<CurrentUser | null>;
  setCurrentUser(user: CurrentUser): Promise<void>;
  deleteCurrentUser(): Promise<void>;
}

class AuthStorage
  extends StoreModel<CurrentUser>
  implements AuthStorageInterface
{
  #accessToken: string | null = null;

  protected serialize(user: CurrentUser): string[] {
    return [user.id, user.username, user.token];
  }
  protected deserialize(dbResponse: [ResultSet]): CurrentUser[] {
    const rows = getRowsFromDbResponse(dbResponse);

    return rows.map<CurrentUser>(row => ({
      id: row.id,
      username: row.username,
      token: row.access_token,
    }));
  }

  public async getCurrentUser(): Promise<CurrentUser | null> {
    const db = await this.getDb();
    const dbResponse = await db.executeSql(
      'SELECT * FROM current_user LIMIT 1',
    );

    const user = this.deserialize(dbResponse).pop();
    if (!user) {
      return null;
    }

    this.#accessToken = user.token;
    return user;
  }

  public async setCurrentUser(user: CurrentUser) {
    const db = await this.getDb();
    await db.transaction(async tx => {
      tx.executeSql('DELETE FROM current_user');
      tx.executeSql(
        'INSERT INTO current_user(id, username, access_token) VALUES(:1, :2, :3)',
        this.serialize(user),
      );
    });
    this.#accessToken = user.token;
    // upsert throws syntax error
    // await dbRef.current?.executeSql(
    //   'INSERT INTO current_user(id, username, access_token) VALUES(:1, :2, :3) ON CONFLICT(id) DO UPDATE SET username=:2, access_token=:3',
    //   [user.id, user.username, 'user.token'],
    // );
  }

  public get token(): string | null {
    return this.#accessToken;
  }

  public async deleteCurrentUser() {
    const db = await this.getDb();
    await db.executeSql('DELETE FROM current_user');
    this.#accessToken = null;
  }
}

export default new AuthStorage();
