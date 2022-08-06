import {FC} from 'react';

import {AllLists} from './screens/AllLists';
import {CurrentList, CurrentListParams} from './screens/CurrentList';
import {EditItem, EditItemParams} from './screens/EditItem';
import {EditList, EditListParams} from './screens/EditList';
import {Sharing, SharingParams} from './screens/Sharing';
import {Landing} from './screens/Landing';
import {Login} from './screens/Login';
import {UnitConverter, UnitConverterParams} from './screens/UnitConverter';
import {UserSearch, UserSearchParams} from './screens/UserSearch';

export type RootStackParamList = {
  [ScreenName.EDIT_LIST]: EditListParams | undefined;
  [ScreenName.EDIT_ITEM]: EditItemParams;
  [ScreenName.SHARE_LIST]: SharingParams;
  [ScreenName.LANDING]: undefined;
  [ScreenName.LOGIN]: undefined;
  [ScreenName.ALL_LISTS]: undefined;
  [ScreenName.CURRENT_LIST]: CurrentListParams;
  [ScreenName.UNIT_CONVERTER]: UnitConverterParams;
  [ScreenName.USER_SEARCH]: UserSearchParams;
};

export enum ScreenName {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  ALL_LISTS = 'ALL_LISTS',
  EDIT_LIST = 'EDIT_LIST',
  SHARE_LIST = 'SHARE_LIST',
  USER_SEARCH = 'USER_SEARCH',
  CURRENT_LIST = 'CURRENT_LIST',
  EDIT_ITEM = 'EDIT_ITEM',
  UNIT_CONVERTER = 'UNIT_CONVERTER',
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
  {name: ScreenName.SHARE_LIST, component: Sharing},
  {name: ScreenName.USER_SEARCH, component: UserSearch},
  {name: ScreenName.CURRENT_LIST, component: CurrentList},
  {name: ScreenName.EDIT_ITEM, component: EditItem},
  {name: ScreenName.UNIT_CONVERTER, component: UnitConverter},
];
