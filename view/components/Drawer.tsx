import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {Button} from 'react-native-elements';

import {NavigationScreenItem, ScreenName, screens} from '../navigation';
import {Store} from '../../providers';
import {Services} from '../../providers/serviceProvider';

const screensInDrawer: ScreenName[] = [
  ScreenName.CURRENT_LIST,
  ScreenName.ALL_LISTS,
  ScreenName.LOGIN,
  ScreenName.UNIT_CONVERTER,
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const {
    currentList,
    setCurrentList,
    setCurrentUser,
    currentUser,
    isConnected,
  } = useContext(Store);

  const {authHttpClient} = useContext(Services);

  const handleLogout = async () => {
    if (isConnected) {
      authHttpClient.logout();
    }

    setCurrentList(null);
    setCurrentUser(null);
    props.navigation.navigate(ScreenName.LANDING);
  };

  return (
    <DrawerContentScrollView {...props}>
      {screens
        .filter(s => isVisible(s, !!currentList?.id, !!currentUser))
        .map(screen => (
          <DrawerItem
            // icon={}
            key={screen.name}
            label={getLabel(screen)}
            onPress={() => props.navigation.navigate(screen.name)}
          />
        ))}
      {!!currentUser && <Button title="Logout" onPress={handleLogout} />}
    </DrawerContentScrollView>
  );
}

function isVisible(
  screen: NavigationScreenItem,
  hasCurrentList: boolean,
  hasCurrentUser: boolean,
): boolean {
  const isNavigable = screensInDrawer.includes(screen.name);
  switch (screen.name) {
    case ScreenName.LOGIN:
      return !hasCurrentUser;
    case ScreenName.ALL_LISTS:
      return hasCurrentUser;
    case ScreenName.CURRENT_LIST:
      return hasCurrentList && hasCurrentUser;
    default:
      return isNavigable;
  }
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
