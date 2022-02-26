import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

export const CurrentList: React.FC<{
  navigation: NativeStackNavigationProp<any>;
}> = ({navigation}) => {
  return (
    <ScrollView>
      <Text>This would be the main page</Text>
    </ScrollView>
  );
};
