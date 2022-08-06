import {StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Chip, Input, Overlay, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm, Controller} from 'react-hook-form';

import {Item, ItemDTO} from '../../types';
import {Unit} from '../../types/unit';
import type {RootStackParamList, ScreenName} from '../navigation';
import {UnitPicker} from '../components/UnitPicker';
import {Services} from '../../providers/serviceProvider';

type ItemInput = ItemDTO & {id?: string};

const blankItem: ItemDTO = {
  name: '',
  description: '',
  totalAmount: 0,
  currentAmount: 0,
  unit: Unit.ITEM,
  tags: [],
  bought: false,
};

export type EditItemParams = {item?: Item; listId: string};

export const EditItem: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.EDIT_ITEM>
> = ({navigation, route}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<Item>();

  const {itemsHttpClient} = useContext(Services);

  const listId = route.params.listId;

  const [tags, setTags] = useState<string[]>(route.params?.item?.tags ?? []);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState<string | null>(null);

  useEffect(() => {
    const item = route.params?.item ?? blankItem;
    setTags(item.tags);
    reset(item);
  }, [reset, route]);

  const submitChange = async (item: ItemInput) => {
    item.totalAmount = parseInt(item.totalAmount.toString(), 10);
    item.tags = tags;
    if (item.id) {
      try {
        itemsHttpClient.updateItem(
          listId,
          item as Partial<Item> & {id: string},
        );
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await itemsHttpClient.createItems(listId, [item]);

        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteSelf = async (item: ItemInput) => {
    if (item.id) {
      await itemsHttpClient.deleteItem(listId, item.id);
      navigation.goBack();
    }
  };

  const addTag = () => {
    setCurrentTag(null);
    setSelectedTag(null);
    setOverlayVisible(!overlayVisible);
  };

  const editTag = (tag: string) => {
    setCurrentTag(tag);
    setSelectedTag(tag);
    setOverlayVisible(!overlayVisible);
  };

  const removeTag = () => {
    const newTags = tags.filter(tag => tag !== selectedTag);
    setTags(newTags);
    setOverlayVisible(!overlayVisible);
  };

  const updateTags = () => {
    if (currentTag && selectedTag) {
      const newTags = tags.map(tag => {
        if (tag === selectedTag) {
          return currentTag;
        }
        return tag;
      });
      setTags(newTags);
    } else if (currentTag) {
      const newTags = Array.from(new Set([...tags, currentTag]));
      setTags(newTags);
    }
    setOverlayVisible(!overlayVisible);
  };

  return (
    <SafeAreaView>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        name="name"
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            value={value}
            placeholder="Ttile"
            autoCompleteType={null}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Text>{errors?.name && 'Missing title'}</Text>

      <Controller
        control={control}
        name="description"
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            value={value}
            placeholder="Description"
            autoCompleteType={null}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Text>{errors?.description && 'Missing description'}</Text>

      <Controller
        control={control}
        rules={{
          required: true,
          min: route.params?.item?.currentAmount ?? 0,
        }}
        name="totalAmount"
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            value={value?.toString()}
            keyboardType="numeric"
            placeholder="Total amount"
            autoCompleteType={null}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <Text>{errors?.totalAmount && 'Invalid total amount'}</Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        name="unit"
        render={({field: {onChange, onBlur, value}}) => (
          <UnitPicker value={value} onChange={onChange} onBlur={onBlur} />
        )}
      />
      <Text>{errors?.unit && 'Invalid unit'}</Text>

      <View style={styles.tagsContainer}>
        {tags.map(tag => (
          <Chip
            key={tag}
            title={tag}
            containerStyle={styles.tagChip}
            titleStyle={styles.tagTitle}
            onPress={() => editTag(tag)}
          />
        ))}
        <Chip
          containerStyle={styles.tagChip}
          onPress={addTag}
          title={''}
          icon={<Icon style={styles.addTagIcon} name="plus" size={20} />}
        />
      </View>
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={styles.addTagOverlay}>
        <Input
          value={currentTag ?? ''}
          placeholder="Tag value"
          autoCompleteType={null}
          onChangeText={setCurrentTag}
        />
        <Button
          buttonStyle={styles.addTagButton}
          title={selectedTag ? 'Update' : 'Add'}
          onPress={updateTags}
        />
        {selectedTag && (
          <Button
            containerStyle={styles.deleteTagButtonContainer}
            buttonStyle={styles.deleteTagButton}
            title="Delete"
            onPress={removeTag}
          />
        )}
      </Overlay>
      <Button
        title="Submit"
        onPress={handleSubmit(submitChange)}
        containerStyle={styles.submitButtonContaienr}
        buttonStyle={styles.submitButton}
      />
      {route.params?.item?.id && (
        <Button
          title="Delete this item"
          onPress={handleSubmit(deleteSelf)}
          containerStyle={styles.submitButtonContaienr}
          buttonStyle={styles.deleteButton}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-end',
  },
  tagChip: {
    margin: 5,
    maxWidth: 150,
    minWidth: 50,
  },
  tagTitle: {
    paddingHorizontal: 15,
    fontSize: 15,
  },
  addTagIcon: {
    color: '#fff',
  },
  addTagOverlay: {
    backgroundColor: '#4a4a4a',
    width: 200,
  },
  submitButtonContaienr: {
    marginTop: 20,
  },
  submitButton: {
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    height: 60,
  },
  deleteButton: {
    backgroundColor: '#543d3d',
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    height: 40,
  },
  addTagButton: {
    borderRadius: 15,
  },
  deleteTagButton: {
    borderRadius: 15,
    backgroundColor: '#543d3d',
  },
  deleteTagButtonContainer: {
    marginTop: 10,
  },
});
