import {MutableRefObject} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import SQLite, {ResultSet} from 'react-native-sqlite-storage';

export async function initLocalDb(
  ref: MutableRefObject<SQLite.SQLiteDatabase | null>,
) {
  if (ref.current !== null) {
    return;
  }
  SQLite.DEBUG(true);
  SQLite.enablePromise(true);
  const db = await SQLite.openDatabase({
    location: 'default',
    name: 'ShoppingList',
  });
  await migrateUp(db);
  ref.current = db;
  AppState.addEventListener('change', state => onAppStateChange(state, ref));

  return db;
}

async function migrateUp(db: SQLite.SQLiteDatabase) {
  const [{rows: isMigratedResult}] = await db.executeSql(
    "SELECT count(name) > 0 as has FROM sqlite_master WHERE type='table' AND (name='lists' OR name='current_user')",
  );
  const isMigrated = isMigratedResult.item(0).has;
  if (isMigrated) {
    return;
  }

  await db.transaction(async tx => {
    await Promise.all([
      // migration version
      tx.executeSql(`CREATE TABLE IF NOT EXISTS db_version(
          version INT
        )`),
      // tx.executeSql('drop table current_user'),
      // current user
      tx.executeSql(`CREATE TABLE IF NOT EXISTS current_user(
          id TEXT NOT NULL PRIMARY KEY,
          username TEXT NOT NULL,
          access_token TEXT
        )`),
      // lists
      tx.executeSql(`CREATE TABLE IF NOT EXISTS lists(
        id TEXT NOT NULL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        owner TEXT NOT NULL
      )`),
    ]);
  });
}

async function onAppStateChange(
  state: AppStateStatus,
  dbRef: MutableRefObject<SQLite.SQLiteDatabase | null>,
) {
  switch (state) {
    case 'background':
      await dbRef.current?.close();
      dbRef.current = null;
      break;
    default:
      break;
  }
}

type MultiInsertResonse = {
  sql: string;
  params: (string | number | boolean)[][];
};

export function multiInsertStatement<T extends {[key: string]: any}>(
  items: T[],
): MultiInsertResonse {
  const columns = Object.keys(items[0]);
  const response: MultiInsertResonse = {
    sql: '',
    params: [],
  };

  const sqlStatements: string[] = [];
  let valueIndex: number = 0;
  const resp = items.reduce((acc, item) => {
    const sql = `(${columns.map(_ => `:${++valueIndex}`).join(', ')})`;
    sqlStatements.push(sql);

    acc.params = [...acc.params, ...Object.values(item)];
    return acc;
  }, response);
  resp.sql = sqlStatements.join(', ');
  return resp;
}

type RowItem = {[key: string]: any};
export function getRowsFromDbResponse(dbRespnse: [ResultSet]): RowItem[] {
  const [{rows}] = dbRespnse;
  const rowItems: RowItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    const item = rows.item(i);
    rowItems.push(item);
  }

  return rowItems;
}
