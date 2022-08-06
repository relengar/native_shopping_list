import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// main
import {theme} from '../../../App';
import {Item, List, Order} from '../../../types';
// services and providers
import {HttpError} from '../../../services/http/error';
import {Services} from '../../../providers/serviceProvider';
import {CurrentItemAction, Store} from '../../../providers';
// navigation
import {RootStackParamList, ScreenName} from '../../navigation';
// components
import {Filters} from '../../components/Filters';
import {ErrorMessage} from '../../components/ErrorMessage';
import {CurrentListEditor} from './CurrentListEditor';
import {CurrentListViewer} from './CurrentListViewer';

const Tab = createMaterialTopTabNavigator();

export type CurrentListParams = {list?: List | null};

type SortKey = keyof Pick<
  Item,
  'name' | 'currentAmount' | 'totalAmount' | 'bought' | 'description'
>;

export type SortSetting = {
  key: SortKey;
  order: Order;
  selected: boolean;
};

export type SortAndFilterSettings = {
  filterTags: string[];
  searchText: string;
  sort: SortSetting[];
};

function compare<T>(val1: T, val2: T, order: Order): number {
  if (val1 === val2) {
    return 0;
  }
  if (order === Order.DESC) {
    return val1 < val2 ? 1 : -1;
  } else {
    return val1 > val2 ? 1 : -1;
  }
}

export const CurrentList: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.CURRENT_LIST>
> = ({navigation, route}) => {
  const allItems = useRef<Item[]>([]);
  const sortAndFilterSettings = useRef<SortAndFilterSettings>({
    filterTags: [],
    searchText: '',
    sort: [
      {
        key: 'name',
        order: Order.DESC,
        selected: true,
      },
      {
        key: 'currentAmount',
        order: Order.DESC,
        selected: false,
      },
      {
        key: 'totalAmount',
        order: Order.DESC,
        selected: false,
      },
      {
        key: 'bought',
        order: Order.DESC,
        selected: false,
      },
      {
        key: 'description',
        order: Order.DESC,
        selected: false,
      },
    ],
  });
  // const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {currentList, currentItems: items, setCurrentItems} = useContext(Store);
  const {itemsHttpClient} = useContext(Services);

  const listId = route.params?.list?.id;

  const editItem = (item: Item) => {
    navigation.navigate(ScreenName.EDIT_ITEM, {listId: listId!, item});
  };

  const createItem = () => {
    navigation.navigate(ScreenName.EDIT_ITEM, {listId: listId!});
  };

  const updateItem = useCallback(
    (updatedItem: Item) => {
      const newItems = items.map(item =>
        updatedItem.id === item.id ? updatedItem : item,
      );

      setCurrentItems({
        action: CurrentItemAction.SET_ALL,
        items: newItems,
      });
    },
    [items, setCurrentItems],
  );

  const sortAndFilter = useCallback(
    (settings: SortAndFilterSettings): void => {
      sortAndFilterSettings.current = settings;
      const newItems = allItems.current
        .filter(item => {
          const isSearched = item.name
            .toLowerCase()
            .includes(settings.searchText.toLowerCase());
          const hasTag =
            !settings.filterTags.length ||
            settings.filterTags.some(tag =>
              item.tags.some(itemTag => itemTag === tag),
            );
          return isSearched && hasTag;
        })
        .sort((item, nextItem) => {
          const {key, order} = settings.sort.find(({selected}) => selected) ?? {
            key: 'name',
            selected: true,
            order: Order.DESC,
          };
          return compare(item[key], nextItem[key], order);
        });
      setCurrentItems({
        action: CurrentItemAction.SET_ALL,
        items: newItems,
      });
    },
    [setCurrentItems],
  );

  useEffect(() => {
    navigation.setParams({list: currentList});
    const id = listId ?? currentList?.id;
    if (!id) {
      navigation.navigate(ScreenName.ALL_LISTS);
    }

    const unsubscribe = navigation.addListener('focus', () => {
      // TODO load data only if forced by navigation somehow?
      setIsLoading(true);
      itemsHttpClient
        .getListItems(id as string)
        .then(itemsData => {
          allItems.current = itemsData;
          sortAndFilter(sortAndFilterSettings.current);
        })
        .catch((err: HttpError) => {
          setError(err.message);
          setIsLoading(false);
        })
        .finally(() => setIsLoading(false));
    });

    return unsubscribe;
  }, [
    listId,
    currentList,
    navigation,
    sortAndFilterSettings,
    sortAndFilter,
    itemsHttpClient,
  ]);

  const renderEditor = () => (
    <CurrentListEditor
      editItem={editItem}
      createItem={createItem}
      updatedItem={updateItem}
      isLoading={isLoading}
    />
  );

  const renderViewer = () => (
    <CurrentListViewer updateParent={updateItem} isLoading={isLoading} />
  );

  return (
    <>
      <Filters
        settings={sortAndFilterSettings.current}
        applySettings={sortAndFilter}
        items={allItems.current}
      />
      <ErrorMessage text={error} />
      <NavigationContainer independent={true} theme={theme}>
        <Tab.Navigator>
          <Tab.Screen name="List" children={renderViewer} />
          <Tab.Screen name="Edit" children={renderEditor} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};
