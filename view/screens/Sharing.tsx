import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';

import {Services} from '../../providers/serviceProvider';
import {User} from '../../types';
import {UserCard} from '../components/UserCard';
import {RootStackParamList, ScreenName} from '../navigation';

export type SharingParams = {
  listId: string;
};

export const Sharing: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.SHARE_LIST>
> = ({navigation, route}) => {
  const listId = route.params.listId;

  const {listsHtpClient} = useContext(Services);

  const [sharees, setSharees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listsHtpClient.getSharees(listId).then(users => {
      const mappedUsers = users.map(user => ({
        ...user,
        sharing: true,
      }));
      setSharees(mappedUsers);
      setIsLoading(false);
    });

    return navigation.addListener('focus', async () => {
      listsHtpClient.getSharees(listId).then(users => {
        const mappedUsers = users.map(user => ({
          ...user,
          sharing: true,
        }));
        setSharees(mappedUsers);
        setIsLoading(false);
      });
    });
  }, [listId, listsHtpClient, navigation]);

  const addSharee = async () => {
    navigation.navigate(ScreenName.USER_SEARCH, {listId});
  };

  const remove = async (user: User) => {
    await listsHtpClient.removeSharing(listId, user.id);
    const newSharees = sharees.filter(sh => sh.id !== user.id);
    setSharees(newSharees);
  };

  return (
    <View>
      {isLoading && <ActivityIndicator size="large" />}
      {sharees.map(sharee => (
        <UserCard key={sharee.id} user={sharee} actionFunction={remove} />
      ))}
      <Button
        containerStyle={styles.addButtonContainer}
        buttonStyle={styles.addButton}
        title={'Add'}
        onPress={addSharee}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    marginTop: 25,
  },
  addButton: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
  },
});
