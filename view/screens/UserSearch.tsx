import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Keyboard, ActivityIndicator} from 'react-native';
import {SearchBar, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Services} from '../../providers/serviceProvider';
import {User} from '../../types';
import {PaginationControl} from '../components/PaginationControl';
import {UserCard} from '../components/UserCard';
import {RootStackParamList, ScreenName} from '../navigation';

export type UserSearchParams = {
  listId: string;
};

type Params = NativeStackScreenProps<
  RootStackParamList,
  ScreenName.USER_SEARCH
>;

export const UserSearch: React.FC<Params> = ({route, navigation}) => {
  const {usersHttpClient, listsHtpClient} = useContext(Services);

  const [isKeyboardDisplayed, setIsKeyboardDisplayed] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalFoundUsers, setTotalFoundUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const listId: string = route.params.listId;

  const search = useCallback(
    async (text: string = searchText, ofPage = page) => {
      setIsLoading(true);
      const foundUsers = await usersHttpClient.search(text, listId, ofPage);
      setUsers(foundUsers.items);
      setTotalFoundUsers(foundUsers.total);
      setIsLoading(false);
    },
    [usersHttpClient, listId, page, searchText],
  );

  useEffect(() => {
    search();

    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardDisplayed(true);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardDisplayed(false);
    });

    const unsubscribeFocus = navigation.addListener('focus', async () => {
      await search();
    });

    console.log(keyboardHide);
    return () => {
      unsubscribeFocus();
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, [search, navigation]);

  const handleSearch = async (text: string = '') => {
    setSearchText(text);

    if (text.length === 0) {
      setUsers([]);
      return;
    }
    await search(text);
  };

  const handleAddOrDelete = async (user: User): Promise<void> => {
    await listsHtpClient.shareList(listId, user.id);

    await search();
  };

  const handlePageChange = async (newPage: number): Promise<void> => {
    setPage(newPage);
    await search(searchText, newPage);
  };

  return (
    <View style={styles.mainContainer}>
      <SearchBar
        value={searchText}
        onChangeText={handleSearch}
        placeholder="enter user name here"
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchInput}
        searchIcon={<Icon name="search" style={styles.searchIcon} />}
      />
      {isLoading && <ActivityIndicator size="large" />}
      {!users.length && <Text style={styles.noUsersText}>No users found</Text>}
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          actionFunction={handleAddOrDelete}
        />
      ))}
      {totalFoundUsers > 0 && !isKeyboardDisplayed && (
        <View style={styles.paginationContainer}>
          <PaginationControl
            page={page}
            limit={4}
            total={totalFoundUsers}
            apply={handlePageChange}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
  },
  searchBar: {
    backgroundColor: '#3d3d3d',
    marginTop: 5,
    marginBottom: 10,
    paddingBottom: 2,
    borderBottomWidth: 0,
  },
  searchInput: {
    borderRadius: 10,
  },
  searchIcon: {
    color: '#fff',
    marginLeft: 3,
  },
  noUsersText: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 17,
  },
  paginationContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 50,
  },
});
