import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text, useTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {User} from '../../types';

type UserCardProps = {
  user: User;
  actionFunction: (user: User) => void | Promise<void>;
};

export const UserCard: React.FC<UserCardProps> = ({user, actionFunction}) => {
  const onPress = () => actionFunction(user);
  const {theme} = useTheme();

  return (
    <Card
      theme={theme.Card}
      containerStyle={user.sharing ? styles.cardHasShared : styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.title}>{user.username}</Text>
        <View style={styles.buttonSection}>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={user.sharing ? styles.buttonRemove : styles.buttonAdd}
            onPress={onPress}
            icon={<Icon name={user.sharing ? 'remove' : 'plus'} size={25} />}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {},
  cardHasShared: {},
  cardBody: {
    flexDirection: 'row',
  },
  title: {
    width: '70%',
    textAlign: 'left',
    alignSelf: 'center',
    fontSize: 18,
  },
  buttonSection: {
    width: '30%',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buttonAdd: {
    height: 50,
  },
  buttonRemove: {
    height: 50,
    backgroundColor: '#5e1514',
  },
});
