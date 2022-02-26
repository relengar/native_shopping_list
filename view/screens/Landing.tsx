import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import {Store} from '../../providers';
import {AuthStorageInterface} from '../../services/store/auth';
import {ScreenName} from '../navigation';

export const Landing: React.FC<{
  navigation: NativeStackNavigationProp<any>;
}> = ({navigation}) => {
  const {authStorage, isInitialized} = useContext(Store);

  useEffect(() => {
    if (isInitialized) {
      getInitialScreen(authStorage).then(screen => {
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
  auth: AuthStorageInterface,
): Promise<ScreenName> {
  const user = await auth.getCurrentUser();
  if (!user) {
    return ScreenName.LOGIN;
  }

  // TODO
  // if currentList go to the list else show all lists
  return ScreenName.ALL_LISTS;
}
