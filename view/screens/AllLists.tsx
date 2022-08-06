import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {Button, Card, Text, useTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ScreenName} from '../navigation';
import type {RootStackParamList} from '../navigation';
import {List} from '../../types';
import {Store} from '../../providers';
import {Services} from '../../providers/serviceProvider';
import {HttpError} from '../../services/http/error';

import {ErrorMessage} from '../components/ErrorMessage';

export const AllLists: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.ALL_LISTS>
> = ({navigation}) => {
  const {theme} = useTheme();

  const {setCurrentList, currentList} = useContext(Store);
  const {listsHtpClient} = useContext(Services);
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState<List[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetListsError = (err: HttpError) => {
    setError(`Get lists failed with status ${err.status}. ${err.message}`);
  };

  useEffect(() => {
    listsHtpClient
      .getLists()
      .then(data => {
        setLists(data.items);
        setIsLoading(false);
      })
      .catch(handleGetListsError);

    return navigation.addListener('focus', async () => {
      // TODO use cache?
      setIsLoading(true);
      listsHtpClient
        .getLists()
        .then(data => {
          setLists(data.items);
          setIsLoading(false);
        })
        .catch(handleGetListsError);
    });
  }, [navigation, listsHtpClient]);

  return (
    <ScrollView style={styles.view}>
      <ErrorMessage text={error} />
      {lists.map(item => (
        <Card
          theme={theme.Card}
          key={item.id}
          containerStyle={
            item.id === currentList?.id
              ? styles.selectedListCard
              : styles.listCard
          }>
          <Card.Title style={styles.title}>{item.title}</Card.Title>
          <Icon
            onPress={() =>
              navigation.navigate(ScreenName.EDIT_LIST, {list: item})
            }
            style={styles.iconEdit}
            name="pencil"
            size={25}
          />
          <Card.Divider />
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.listButtonsView}>
            <Button
              title={item.id === currentList?.id ? 'Go to' : 'Select'}
              containerStyle={styles.listSelectButtonContainer}
              buttonStyle={styles.selectButton}
              onPress={() => {
                setCurrentList(item);
                navigation.navigate(ScreenName.CURRENT_LIST, {list: item});
              }}
            />
            <Button
              containerStyle={styles.listShareButtonContainer}
              buttonStyle={styles.shareButton}
              onPress={() =>
                navigation.navigate(ScreenName.SHARE_LIST, {
                  listId: item.id,
                })
              }
              icon={<Icon name="share-alt" size={25} />}
            />
          </View>
        </Card>
      ))}
      <Button
        title={'Create new'}
        containerStyle={styles.createButtonContainer}
        buttonStyle={styles.createButton}
        onPress={() => navigation.navigate(ScreenName.EDIT_LIST)}
      />
      {isLoading && <ActivityIndicator size="large" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingVertical: 10,
  },
  listButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  listSelectButtonContainer: {
    width: '80%',
    borderRadius: 15,
  },
  listShareButtonContainer: {
    width: '20%',
    borderRadius: 15,
  },
  selectButton: {
    margin: 5,
    borderRadius: 15,
    width: '80%',
    alignSelf: 'center',
  },
  shareButton: {
    borderRadius: 15,
  },
  listCard: {},
  selectedListCard: {
    backgroundColor: '#444242',
  },
  iconEdit: {
    position: 'absolute',
    right: 0,
  },
  title: {
    fontSize: 18,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    paddingBottom: 5,
  },
  createButtonContainer: {
    margin: 20,
  },
  createButton: {
    borderRadius: 10,
    height: 50,
    width: 300,
    alignSelf: 'center',
  },
});
