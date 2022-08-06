import React, {useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList, ScreenName} from '../navigation';
import {View, StyleSheet} from 'react-native';
import {Input, Text} from 'react-native-elements';
import {Unit, UnitGroup} from '../../types/unit';
import {Picker} from '@react-native-picker/picker';
import {convertUnit, unitGroupsMap} from '../../services/units';
import {UnitPicker} from '../components/UnitPicker';

const DISPLAY_PRECISION = 3;

export type UnitConverterParams = {
  amount?: string;
  from?: Unit;
};

export const UnitConverter: React.FC<
  NativeStackScreenProps<RootStackParamList, ScreenName.UNIT_CONVERTER>
> = ({route}) => {
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(Unit.GRAM);
  const [toUnit, setToUnit] = useState<Unit>(Unit.GRAM);
  const [unitGroup, setUnitGroup] = useState<UnitGroup>(UnitGroup.MASS);

  useEffect(() => {
    if (route.params?.amount) {
      const newAmount = isNaN(parseFloat(route.params.amount))
        ? '1'
        : route.params.amount;
      setFromAmount(newAmount);
    }
  }, [route.params?.amount]);

  const parse = (value: string) => {
    const newValue = parseFloat(value);
    return isNaN(newValue) ? 0 : newValue;
  };

  const convertTo = (
    inputValue: string = fromAmount,
    from: Unit = fromUnit,
    to: Unit = toUnit,
  ) => {
    const fromValue = parse(inputValue);

    const convertedToAmount = convertUnit(fromValue, from, to);
    setFromAmount(inputValue);
    setToAmount(convertedToAmount.toFixed(DISPLAY_PRECISION));
  };

  const convertFrom = (inputValue: string = toAmount, to: Unit = toUnit) => {
    const toValue = parse(inputValue);

    const convertedFromAmount = convertUnit(toValue, to, fromUnit);
    setToAmount(inputValue);
    setFromAmount(convertedFromAmount.toFixed(DISPLAY_PRECISION));
  };

  const handleFromUnitChange = (unit: Unit) => {
    setFromUnit(unit);
    convertTo(fromAmount, unit);
  };

  const handleToUnitChange = (unit: Unit) => {
    setToUnit(unit);
    convertTo(fromAmount, fromUnit, unit);
  };

  const handleGroupChange = (group: UnitGroup) => {
    const defaultUnit = unitGroupsMap.get(group)?.pop();
    if (defaultUnit) {
      setFromAmount('1');
      setToAmount('1');
      setFromUnit(defaultUnit);
      setToUnit(defaultUnit);
    }
    setUnitGroup(group);
  };

  return (
    <View>
      <View style={styles.inputsSection}>
        <Input
          containerStyle={styles.amountInputContainerFrom}
          style={styles.amountInput}
          value={fromAmount}
          keyboardType="numeric"
          placeholder="Amount"
          autoCompleteType={null}
          onChangeText={convertTo}
        />
        <Text style={styles.equalSign}>=</Text>
        <Input
          containerStyle={styles.amountInputContainerTo}
          style={styles.amountInput}
          value={toAmount}
          keyboardType="numeric"
          placeholder="Amount"
          autoCompleteType={null}
          onChangeText={convertFrom}
        />
      </View>
      <View style={styles.unitsSection}>
        <UnitPicker
          containerStyle={styles.picker}
          value={fromUnit}
          group={unitGroup}
          onChange={handleFromUnitChange}
        />
        <UnitPicker
          containerStyle={styles.picker}
          value={toUnit}
          group={unitGroup}
          onChange={handleToUnitChange}
        />
      </View>
      <Picker
        style={styles.unitTypePicker}
        selectedValue={unitGroup}
        onValueChange={handleGroupChange}
        mode={'dropdown'}>
        {Object.values(UnitGroup).map(name => (
          <Picker.Item
            key={name}
            value={name}
            label={name}
            style={styles.unitTypePickerItem}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  inputsSection: {
    marginTop: 50,
    marginRight: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitsSection: {
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountInputContainerFrom: {
    width: '38%',
    marginHorizontal: 2,
  },
  amountInputContainerTo: {
    marginHorizontal: 2,
    width: '45%',
  },
  amountInput: {
    textAlign: 'center',
  },
  picker: {
    width: '50%',
  },
  equalSign: {
    marginHorizontal: 20,
    alignSelf: 'center',
    fontSize: 25,
  },
  unitTypePicker: {
    marginHorizontal: 10,
  },
  unitTypePickerItem: {
    backgroundColor: '#4a4a4a',
    color: '#fff',
  },
});
