import React, {useContext} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {CheckBox, Text} from 'react-native-elements';

import {Item} from '../../../types/index';
import {Store} from '../../../providers';
import {Services} from '../../../providers/serviceProvider';
import {getUnitAbbrevation} from '../../../services/units';

type CurrentListViewerParams = {
  updateParent: (items: Item) => void;
  isLoading: boolean;
};

export const CurrentListViewer: React.FC<CurrentListViewerParams> = ({
  isLoading,
}: CurrentListViewerParams) => {
  const {currentList, updateItem, currentItems: items} = useContext(Store);
  const {itemsHttpClient} = useContext(Services);

  const toggleItem = async (item: Item) => {
    const {currentAmount, totalAmount} = item;
    const updatedItem: Item = {
      ...item,
      currentAmount: currentAmount < totalAmount ? totalAmount : 0,
    };

    await itemsHttpClient.updateItem(currentList!.id, {
      id: updatedItem.id,
      currentAmount: updatedItem.currentAmount,
    });

    updateItem(updatedItem);
  };

  return (
    <ScrollView>
      {isLoading && <ActivityIndicator style={styles.spinner} size="large" />}
      {items.map(item => (
        <View style={styles.itemView} key={item.id}>
          <CheckBox
            disabled={isLoading}
            title={
              <View style={styles.checkboxText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemAmount}>
                  {item.totalAmount} {getUnitAbbrevation(item.unit)}
                </Text>
              </View>
            }
            checked={item.currentAmount === item.totalAmount}
            onPress={() => toggleItem(item)}
            containerStyle={styles.checkbox}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemView: {
    marginTop: 10,
  },
  checkbox: {
    backgroundColor: '#383838',
  },
  checkboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
  },
  itemName: {
    fontSize: 16,
    paddingHorizontal: 10,
    width: '60%',
  },
  itemAmount: {
    fontSize: 16,
    fontStyle: 'italic',
    paddingHorizontal: 5,
    width: '35%',
    textAlign: 'right',
  },
  spinner: {
    paddingBottom: 20,
  },
});
