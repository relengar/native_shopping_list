import React, {useContext} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';
import {ListItem} from '../../components/ListItem';
import {Item} from '../../../types/index';
import {Store} from '../../../providers';

type CurrentListEditorParams = {
  editItem: (item: Item) => void;
  createItem: () => void;
  updatedItem: (item: Item) => void;
  isLoading: boolean;
};

export const CurrentListEditor: React.FC<CurrentListEditorParams> = ({
  editItem,
  createItem,
  isLoading,
}: CurrentListEditorParams) => {
  const {currentItems: items} = useContext(Store);

  return (
    <ScrollView>
      {isLoading && <ActivityIndicator style={styles.spinner} size="large" />}
      {items.map(item => (
        <ListItem
          key={`${item.id}${item.totalAmount}`}
          item={item}
          editItem={editItem}
        />
      ))}
      <View style={styles.addButtonContainer}>
        <Button
          buttonStyle={styles.addButton}
          title={'Add new'}
          onPress={createItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spinner: {
    paddingBottom: 20,
  },
  addButton: {
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    height: 60,
  },
  addButtonContainer: {
    marginTop: 25,
    marginBottom: 30,
  },
});
