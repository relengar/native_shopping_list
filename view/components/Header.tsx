import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';
import {DrawerHeaderProps} from '@react-navigation/drawer';

export const header: (props: DrawerHeaderProps) => React.ReactNode = ({
  navigation,
  route,
}) => {
  const toggleDrawer = () => navigation.toggleDrawer();
  const goBack = () => navigation.goBack();

  return (
    <Header
      centerComponent={<Text style={headerText}>{toTitle(route.name)}</Text>}
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

function toTitle(name: string): string {
  return `${name[0]}${name.slice(1, name.length).toLowerCase()}`.replace(
    /_/,
    ' ',
  );
}
