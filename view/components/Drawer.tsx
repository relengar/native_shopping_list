import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {NavigationScreenItem, ScreenName, screens} from '../navigation';
import {Button} from 'react-native-elements';
import authClient from '../../services/http/auth';
import connection from '../../services/http/connectivity';
import {AuthStorageInterface} from '../../services/store/auth';

const screensInDrawer: ScreenName[] = [ScreenName.ALL_LISTS, ScreenName.LOGIN];

export function DrawerContent(
  props: DrawerContentComponentProps & {authStorage: AuthStorageInterface},
) {
  const handleLogout = async () => {
    if (connection.connected) {
      authClient.logout();
    }

    await props.authStorage.deleteCurrentUser();

    props.navigation.navigate(ScreenName.LANDING);
  };

  return (
    <DrawerContentScrollView {...props}>
      {screens.filter(isVisible).map(screen => (
        <DrawerItem
          // icon={}
          key={screen.name}
          label={getLabel(screen)}
          onPress={() => props.navigation.navigate(screen.name)}
        />
      ))}
      <Button title="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

function isVisible(screen: NavigationScreenItem): boolean {
  return screensInDrawer.includes(screen.name);
}

function getLabel({label, name}: NavigationScreenItem): string {
  if (label) {
    return label;
  }
  return `${name.slice(0, 1).toUpperCase()}${name
    .slice(1, name.length)
    .toLowerCase()
    .replace(/_/g, ' ')}`;
}
