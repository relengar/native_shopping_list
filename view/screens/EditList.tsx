import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {Button, Input, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {Store} from '../../providers';
import {List, ListDTO} from '../../types';
import {RootStackParamList, ScreenName} from '../navigation';
import {StyleSheet} from 'react-native';
import {Services} from '../../providers/serviceProvider';

const blankList: ListDTO = {
  title: '',
  description: '',
};

type ListInput = ListDTO & {id?: string};

export type EditListParams = {list: List};

export const EditList: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.EDIT_LIST>
> = ({navigation, route}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<List>();

  const {listsHtpClient} = useContext(Services);
  const {currentUser, currentList, setCurrentList} = useContext(Store);

  useEffect(() => {
    const list = route.params?.list ?? blankList;
    reset(list);
  }, [reset, route]);

  const submitChange = async (list: ListInput) => {
    if (list.id) {
      try {
        listsHtpClient.updateList(list as List);
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await listsHtpClient.createList(list, currentUser!.id);

        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteThisList = async () => {
    if (!route.params?.list.id) {
      return;
    }

    await listsHtpClient.deleteList(route.params?.list.id);

    if (currentList?.id === route.params?.list.id) {
      setImmediate(() => setCurrentList(null));
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: ScreenName.ALL_LISTS,
        },
      ],
    });
  };

  return (
    <SafeAreaView>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        name="title"
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
      <Text>{errors?.title && 'Missing title'}</Text>
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
      <Button
        buttonStyle={styles.submitButton}
        title="Submit"
        onPress={handleSubmit(submitChange)}
      />
      {route.params?.list.id && (
        <Button
          buttonStyle={styles.deleteButton}
          containerStyle={styles.deleteButtonContainer}
          title="Delete"
          onPress={handleSubmit(deleteThisList)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    height: 60,
  },
  deleteButtonContainer: {
    marginVertical: 20,
  },
  deleteButton: {
    backgroundColor: '#543d3d',
    alignSelf: 'center',
    width: '95%',
    borderRadius: 15,
    height: 40,
  },
});
