import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Slider, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash.debounce';
import {Store} from '../../providers';
import {Item} from '../../types';
import {getUnitAbbrevation} from '../../services/units';
import {Services} from '../../providers/serviceProvider';

export const ListItem: React.FC<{
  item: Item;
  editItem: (item: Item) => void;
}> = ({item, editItem}) => {
  const [currentAmount, setCurrentAmount] = useState<number>(
    item.currentAmount,
  );

  const {itemsHttpClient} = useContext(Services);
  const {currentList, updateItem} = useContext(Store);
  useEffect(() => {
    setCurrentAmount(item.currentAmount);
  }, [item]);

  const handleAmountUpdate = async (amount: number) => {
    await itemsHttpClient.updateItem(currentList!.id, {
      id: item.id,
      currentAmount: amount,
    });

    updateItem({...item, currentAmount: amount});
  };

  const debouncedUpate = debounce(handleAmountUpdate, 500);

  const handleButton = useCallback(
    async (amount: number) => {
      if (amount <= item.totalAmount && amount >= 0) {
        debouncedUpate(amount);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <View style={styles.header}>
        <Button
          icon={
            <Icon size={17} name="arrow-right" style={styles.titleButtonIcon} />
          }
          iconRight
          buttonStyle={styles.titleButton}
          containerStyle={styles.titleButtonContainer}
          titleStyle={styles.itemTitle}
          title={item.name}
          onPress={() => editItem(item)}
        />
      </View>
      <View style={styles.itemView}>
        <Button
          containerStyle={styles.amountIconContainer}
          buttonStyle={styles.amountIcon}
          disabledStyle={styles.amountIconDisabled}
          icon={<Icon size={17} name="minus" />}
          disabled={currentAmount === 0}
          onPress={() => handleButton(currentAmount - 1)}
        />
        <Slider
          style={styles.slider}
          value={currentAmount}
          onValueChange={setCurrentAmount}
          maximumValue={item.totalAmount}
          minimumValue={0}
          onSlidingComplete={handleAmountUpdate}
          step={0.5}
          maximumTrackTintColor="#5b753c"
          minimumTrackTintColor="#4b5e33"
          thumbStyle={styles.sliderThumb}
          trackStyle={styles.sliderTrack}
        />
        <Button
          containerStyle={styles.amountIconContainer}
          buttonStyle={styles.amountIcon}
          disabledStyle={styles.amountIconDisabled}
          icon={<Icon size={17} name="plus" />}
          onPress={() => handleButton(currentAmount + 1)}
          disabled={currentAmount === item.totalAmount}
        />
      </View>
      <Text style={styles.currentAmount}>
        {currentAmount} {getUnitAbbrevation(item.unit)}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  itemTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  header: {
    marginVertical: 10,
  },
  slider: {
    alignSelf: 'center',
    width: '70%',
  },
  sliderThumb: {
    height: 25,
    width: 25,
    backgroundColor: '#627a50',
  },
  sliderTrack: {
    height: 5,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
  currentAmount: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 17,
  },
  amountIcon: {
    backgroundColor: '#8c8f89',
    borderRadius: 50,
    padding: 15,
    height: 45,
    width: 45,
  },
  amountIconDisabled: {
    backgroundColor: '#525050',
  },
  amountIconContainer: {
    borderRadius: 50,
    margin: 3,
  },
  titleButton: {
    backgroundColor: '#3d3d3d',
    borderTopWidth: 2,
  },
  titleButtonContainer: {
    width: '100%',
    marginVertical: 5,
  },
  titleButtonIcon: {
    color: '#5b753c',
    marginLeft: 10,
  },
});
