import {FC} from 'react';
import {AllLists} from './screens/AllLists';
import {CurrentList} from './screens/CurrentList';
import {EditList} from './screens/EditList';
import {Landing} from './screens/Landing';
import {Login} from './screens/Login';

type Generic = {list?: {[key: string]: any}}; // todo temp type

export type RootStackParamList = {
  [ScreenName.EDIT_LIST]: Generic | undefined;
  [ScreenName.LANDING]: undefined;
  [ScreenName.LOGIN]: undefined;
  [ScreenName.ALL_LISTS]: undefined;
  [ScreenName.CURRENT_LIST]: undefined;
};

export enum ScreenName {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  ALL_LISTS = 'ALL_LISTS',
  EDIT_LIST = 'EDIT_LIST',
  CURRENT_LIST = 'CURRENT_LIST',
}

export type NavigationScreenItem = {
  name: ScreenName;
  component: FC<any>;
  label?: string;
};

export const screens: NavigationScreenItem[] = [
  {name: ScreenName.LANDING, component: Landing},
  {name: ScreenName.LOGIN, component: Login},
  {name: ScreenName.ALL_LISTS, component: AllLists},
  {name: ScreenName.EDIT_LIST, component: EditList},
  {name: ScreenName.CURRENT_LIST, component: CurrentList},
];
