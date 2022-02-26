import React, {
  createContext,
  ReactChild,
  ReactChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import SQLite from 'react-native-sqlite-storage';
import authStorage, {AuthStorageInterface} from '../services/store/auth';
import {initLocalDb} from '../services/store';
import listStorage, {ListsStorageInterface} from '../services/store/lists';

type StoreContext = {
  isInitialized: boolean;
  authStorage: AuthStorageInterface;
  listStorage: ListsStorageInterface;
};

type StoreProviderProps = {
  children: ReactChild | ReactChildren;
};

export const Store = createContext<StoreContext>({
  isInitialized: false,
  authStorage,
  listStorage,
});

export const StoreProvider = ({children}: StoreProviderProps) => {
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const getDbInstace = async () => {
    await initLocalDb(dbRef).catch(error =>
      console.error('Failed db init', error),
    );
    console.log('db initalized');
  };

  useEffect(() => {
    // setIsInitialized(!!dbRef);
    getDbInstace().then(() => {
      authStorage.initialize(dbRef, getDbInstace);
      listStorage.initialize(dbRef, getDbInstace);
      setIsInitialized(true);
    });
  });

  return (
    <Store.Provider
      value={{
        isInitialized,
        authStorage,
        listStorage,
      }}>
      <>{children}</>
    </Store.Provider>
  );
};
