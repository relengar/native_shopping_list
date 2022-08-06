import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
import {DrawerHeaderProps} from '@react-navigation/drawer';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {ScreenName} from '../navigation';
import {CurrentListParams} from '../screens/CurrentList';

export const header: (props: DrawerHeaderProps) => React.ReactNode = ({
  navigation,
  route,
}) => {
  const toggleDrawer = () => navigation.toggleDrawer();
  const goBack = () => navigation.goBack();

  return (
    <Header
      centerComponent={<Text style={headerText}>{toTitle(route)}</Text>}
      rightComponent={<Icon name="bars" size={30} onPress={toggleDrawer} />}
      leftComponent={
        <>
          {navigation.canGoBack() && (
            <Icon name="arrow-left" size={30} onPress={goBack} />
          )}
        </>
      }
    />
  ) as React.ReactNode;
};

const {headerText} = StyleSheet.create({
  headerText: {
    fontSize: 20,
    color: '#fff',
  },
});

function toTitle(route: RouteProp<ParamListBase, string>): string {
  let name = route.name;
  if (route.name === ScreenName.CURRENT_LIST) {
    const params: CurrentListParams = route.params
      ? route.params
      : {list: null};
    name = params.list?.title ?? ' ';
  }

  return `${name[0]}${name.slice(1, name.length).toLowerCase()}`.replace(
    /_/,
    ' ',
  );
}
