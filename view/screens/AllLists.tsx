import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {Button, Card, Text, useTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenName} from '../navigation';
import listsClient from '../../services/http/lists';
import {List} from '../../services/store/lists';
import {Store} from '../../providers';

export const AllLists: React.FC<{
  navigation: NativeStackNavigationProp<any>;
}> = ({navigation}) => {
  const {theme} = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState<List[]>([]);
  const {listStorage} = useContext(Store);

  useEffect(() => {
    listsClient
      .getLists()
      .then(data => {
        setLists(data.items);
        listStorage.setAllLists(data.items).catch(err => console.error(err));
        setIsLoading(false);
      })
      .catch(err => console.error(err));

    return navigation.addListener('focus', async () => {
      const currentLists = await listStorage.getLists();
      setLists(currentLists);
    });
  }, [listStorage, navigation]);

  return (
    <ScrollView style={styles.view}>
      {lists.map(item => (
        <Card
          theme={theme.Card}
          key={item.id}
          // eslint-disable-next-line react-native/no-inline-styles
          containerStyle={item.id === '2' ? {backgroundColor: '#627a50'} : {}}>
          <Card.Title style={styles.title}>{item.title}</Card.Title>
          <Icon style={styles.icon} name="file" size={25} />
          <Card.Divider />
          <Text style={styles.description}>{item.description}</Text>
          <Button
            title={'Select'}
            // eslint-disable-next-line react-native/no-inline-styles
            buttonStyle={{
              margin: 5,
              borderRadius: 15,
              width: 250,
              alignSelf: 'center',
            }}
            onPress={() =>
              navigation.navigate(ScreenName.EDIT_LIST, {list: item})
            }
          />
        </Card>
      ))}
      <Button
        title={'Create new'}
        containerStyle={{
          margin: 20,
        }}
        buttonStyle={{
          borderRadius: 10,
          height: 50,
          width: 300,
          alignSelf: 'center',
        }}
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
  addButton: {},
  icon: {
    position: 'absolute',
    right: 0,
  },
  button: {},
  title: {
    fontSize: 18,
  },
  description: {
    textAlign: 'center',
    fontSize: 15,
    paddingBottom: 5,
  },
});
