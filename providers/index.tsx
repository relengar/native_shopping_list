import React, {
  createContext,
  ReactChild,
  ReactChildren,
  useEffect,
  useState,
  useCallback,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrentUser, Item, List} from '../types';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {AuthHttpClientInterface} from '../services/http/auth';

export enum StorageKeys {
  AUTH_TOKEN = 'AUTH_TOKEN',
  CURRENT_LIST = 'CURRENT_LIST',
}

type StoreContext = {
  isInitialized: boolean;
  isConnected: boolean | null;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  setCurrentList: (list: List | null) => void;
  currentList: List | null;
  currentItems: Item[];
  setCurrentItems: (action: CurrentItemsDispatchPayload) => void;
  updateItem: (item: Item) => void;
};

export type ProviderProps = {
  children: ReactChild | ReactChildren;
};

export const Store = createContext<StoreContext>({} as StoreContext);

// TODO tidy up the code, use separate provider, extract reducer to separate logic wihin providers folder?
export enum CurrentItemAction {
  SET_ALL,
  UPDATE,
}
type CurrentItemsDispatchPayload = {
  action: CurrentItemAction;
  items: Item[];
};

function updateItemsReducer(
  items: Item[],
  {action, items: newItems}: CurrentItemsDispatchPayload,
): Item[] {
  if (action === CurrentItemAction.SET_ALL) {
    return newItems;
  }
  if (action === CurrentItemAction.UPDATE) {
    const updatedItems = items.map(item => {
      const newItem = newItems.find(n => n.id === item.id);
      return newItem ?? item;
    });

    return updatedItems;
  }

  return [];
}

interface StoreProviderParams extends ProviderProps {
  authClient: AuthHttpClientInterface;
}

export const StoreProvider = ({children, authClient}: StoreProviderParams) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [currentItems, setCurrentItems] = useReducer(updateItemsReducer, []);
  const {isConnected} = useNetInfo();

  const setUser = (user: CurrentUser | null) => {
    const newToken = user?.token ?? null;
    authClient.setToken(newToken);
    if (newToken) {
      AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, newToken);
    } else {
      AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
      setCurrentListHandler(null);
    }
    setCurrentUser(user);
  };

  const setUserCallback = useCallback(setUser, [authClient]);

  const setCurrentListHandler = (list: List | null) => {
    if (list) {
      AsyncStorage.setItem(StorageKeys.CURRENT_LIST, JSON.stringify(list));
      setCurrentList(list);
    } else {
      AsyncStorage.removeItem(StorageKeys.CURRENT_LIST);
      setCurrentList(list);
      setCurrentItems({
        action: CurrentItemAction.SET_ALL,
        items: [],
      });
    }
  };

  const updateItem = (newItem: Item) => {
    setCurrentItems({
      action: CurrentItemAction.UPDATE,
      items: [newItem],
    });
  };

  useEffect(() => {
    let initCompleted = false;
    if (!currentList) {
      AsyncStorage.getItem(StorageKeys.CURRENT_LIST).then(list => {
        const parsedList = list ? JSON.parse(list) : null;
        setCurrentListHandler(parsedList);
      });
    }

    NetInfo.fetch().then(async state => {
      if (state.isConnected && !currentUser) {
        const user = await onInternetConnection(authClient);
        setUserCallback(user);
      }
      initCompleted = true;
      setIsInitialized(initCompleted);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && !currentUser && initCompleted) {
        onInternetConnection(authClient).then(user => {
          setUserCallback(user);
        });
      }
    });

    return unsubscribe;
  }, [currentUser, currentList, setUserCallback, authClient]);

  return (
    <Store.Provider
      value={{
        isInitialized,
        isConnected,
        currentUser,
        setCurrentUser: setUser,
        currentList,
        setCurrentList: setCurrentListHandler,
        currentItems,
        setCurrentItems,
        updateItem,
      }}>
      <>{children}</>
    </Store.Provider>
  );
};

async function onInternetConnection(
  authClient: AuthHttpClientInterface,
): Promise<CurrentUser | null> {
  const token = await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
  authClient.setToken(token);
  try {
    const currentUser = await authClient.getCurrentUser();
    return {
      ...currentUser,
      token: token!,
    };
  } catch (_error) {
    return null;
  }
}
