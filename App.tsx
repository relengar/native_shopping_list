/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {Theme, DarkTheme, NavigationContainer} from '@react-navigation/native';
import {Store, StoreProvider} from './providers';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {header} from './view/components/Header';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './view/components/Drawer';
import {RootStackParamList, ScreenName, screens} from './view/navigation';
import {ThemeProvider} from 'react-native-elements';

const Drawer = createDrawerNavigator<RootStackParamList>();
const theme: Theme = {
  ...DarkTheme,
  colors: {
    primary: '#474a43',
    background: '#3d3d3d',
    border: '#141414',
    card: '#454a3f',
    notification: '#454a3f',
    text: '#ffffff',
    // ...DarkTheme.colors,
  },
};

// TODO set some global theme

const MainView = gestureHandlerRootHOC(({children}) => (
  <SafeAreaProvider>
    <ThemeProvider theme={theme} useDark={true}>
      {children}
    </ThemeProvider>
  </SafeAreaProvider>
));

export const App = () => {
  const {authStorage} = useContext(Store);

  return (
    <MainView>
      <StoreProvider>
        <NavigationContainer theme={theme}>
          <Drawer.Navigator
            initialRouteName={ScreenName.LANDING}
            backBehavior="history"
            drawerContent={props => {
              return <DrawerContent {...props} authStorage={authStorage} />;
            }}
            screenOptions={{
              drawerPosition: 'right',
              header,
            }}>
            {screens.map((screen, i) => (
              <Drawer.Screen
                key={i}
                name={screen.name}
                component={screen.component}
              />
            ))}
          </Drawer.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </MainView>
  );
};
