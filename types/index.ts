import {Unit} from './unit';

export interface CurrentUser extends User {
  token: string;
}

export type User = {
  id: string;
  username: string;
  sharing?: boolean | null;
};

export type List = {
  id: string;
  title: string;
  description: string;
  owner: string;
};

export type ListDTO = Omit<List, 'id' | 'owner'>;

export type CurrentList = List & {items: Item[]};

export type Item = {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  currentAmount: number;
  unit: Unit;
  bought: boolean;
  tags: string[];
};

export type ItemDTO = Omit<Item, 'id'>;

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
