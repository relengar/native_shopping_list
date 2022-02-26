import {MutableRefObject} from 'react';
import {ResultSet, SQLiteDatabase} from 'react-native-sqlite-storage';

export abstract class StoreModel<T> {
  private dbRef: MutableRefObject<SQLiteDatabase | null> | null = null;
  private getDbInstance: () => Promise<void> = getDbBeforeInit;
  protected abstract serialize(data: T): string[];
  protected abstract deserialize(row: [ResultSet]): T[];

  public initialize(
    dbRef: MutableRefObject<SQLiteDatabase | null>,
    getDbInstance: () => Promise<void>,
  ) {
    this.dbRef = dbRef;
    this.getDbInstance = getDbInstance;
  }

  protected async getDb(): Promise<SQLiteDatabase> {
    if (!this.dbRef) {
      await getDbBeforeInit();
    }
    if (!this.dbRef?.current) {
      await this.getDbInstance();
    }

    return this.dbRef!.current!;
  }
}

async function getDbBeforeInit() {
  throw new Error('Called before initialization');
}
