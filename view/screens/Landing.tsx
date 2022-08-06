import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import {Store} from '../../providers';
import {ScreenName} from '../navigation';

export const Landing: React.FC<{
  navigation: NativeStackNavigationProp<any>;
}> = ({navigation}) => {
  const {currentUser, currentList, isInitialized} = useContext(Store);

  useEffect(() => {
    if (isInitialized) {
      getInitialScreen(!!currentUser, !!currentList?.id).then(screen => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: screen,
            },
          ],
        });
      });
    }
  });

  return (
    <SafeAreaView>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};

async function getInitialScreen(
  hasCurrentUser: boolean,
  hasCurrentList: boolean,
): Promise<ScreenName> {
  if (!hasCurrentUser) {
    return ScreenName.LOGIN;
  }

  if (hasCurrentList) {
    return ScreenName.CURRENT_LIST;
  }

  return ScreenName.ALL_LISTS;
}
