import React, {createContext} from 'react';
import {ProviderProps} from '.';
import {AuthHttpClientInterface} from '../services/http/auth';
import {ItemsClientInterface} from '../services/http/items';
import {ListHttpClientInterface} from '../services/http/lists';
import {UsersClientInterface} from '../services/http/users';

export interface ServicesInterface {
  usersHttpClient: UsersClientInterface;
  authHttpClient: AuthHttpClientInterface;
  listsHtpClient: ListHttpClientInterface;
  itemsHttpClient: ItemsClientInterface;
}

export const Services = createContext<ServicesInterface>(
  {} as ServicesInterface,
);

interface ServicesProviderProps extends ProviderProps {
  services: ServicesInterface;
}

export const ServicesProvider = ({
  children,
  services,
}: ServicesProviderProps) => {
  return <Services.Provider value={services}>{children}</Services.Provider>;
};
