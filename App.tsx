import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import React from 'react';
import {Theme, DarkTheme, NavigationContainer} from '@react-navigation/native';
import {StoreProvider} from './providers';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {header} from './view/components/Header';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './view/components/Drawer';
import {RootStackParamList, ScreenName, screens} from './view/navigation';
import {ThemeProvider} from 'react-native-elements';
import {ServicesInterface, ServicesProvider} from './providers/serviceProvider';
import {AuthClient} from './services/http/auth';
import {UsersClient} from './services/http/users';
import {ListsClient} from './services/http/lists';
import {ItemsClient} from './services/http/items';

const Drawer = createDrawerNavigator<RootStackParamList>();
export const theme: Theme = {
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

const MainView = gestureHandlerRootHOC(({children}) => (
  <SafeAreaProvider>
    <ThemeProvider theme={theme} useDark={true}>
      {children}
    </ThemeProvider>
  </SafeAreaProvider>
));

const authClient = new AuthClient();

const services: ServicesInterface = {
  authHttpClient: authClient,
  usersHttpClient: new UsersClient(),
  listsHtpClient: new ListsClient(),
  itemsHttpClient: new ItemsClient(),
};

export const App = () => {
  return (
    <MainView>
      <ServicesProvider services={services}>
        <StoreProvider authClient={authClient}>
          <NavigationContainer theme={theme}>
            <Drawer.Navigator
              initialRouteName={ScreenName.LANDING}
              backBehavior="history"
              drawerContent={props => {
                return <DrawerContent {...props} />;
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
      </ServicesProvider>
    </MainView>
  );
};
