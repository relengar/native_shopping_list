import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import {Button, Input, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {List, ListDTO} from '../../services/store/lists';
import {Store} from '../../providers';
import listClient from '../../services/http/lists';

const blankList: ListDTO = {
  title: '',
  description: '',
};

type ListInput = ListDTO & {id?: string};

export const EditList: React.FC<{
  navigation: NativeStackNavigationProp<any>;
  route: any; // TODO create list type
}> = ({navigation, route}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<List>();
  const {listStorage, authStorage} = useContext(Store);

  useEffect(() => {
    const list = route.params?.list ?? blankList;
    reset(list);
  }, [reset, route]);

  const submitChange = async (list: ListInput) => {
    if (list.id) {
      try {
        const updatedList = await listClient.updateList(list as List);
        await listStorage.updateList(updatedList);
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    } else {
      const user = await authStorage.getCurrentUser();
      try {
        const newList = await listClient.createList(list, user!.id);
        await listStorage.addList(newList);
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    }
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
        rules={{
          required: true,
        }}
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
      <Button title="Submit" onPress={handleSubmit(submitChange)} />
    </SafeAreaView>
  );
};
