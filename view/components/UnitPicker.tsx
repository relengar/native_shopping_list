import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TargetedEvent,
  View,
  ViewStyle,
} from 'react-native';
import {Unit, UnitGroup} from '../../types/unit';
import {
  getUnitAbbrevation,
  translateUnit,
  unitGroupsMap,
} from '../../services/units';

type UnitPickerProps = {
  value: Unit;
  group?: UnitGroup;
  onChange: (value: Unit) => void;
  onBlur?: (value: NativeSyntheticEvent<TargetedEvent>) => void;
  containerStyle?: ViewStyle;
};

export const UnitPicker: React.FC<UnitPickerProps> = ({
  value,
  group,
  onChange,
  onBlur,
  containerStyle,
}) => {
  return (
    <View style={containerStyle}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        mode={'dropdown'}
        onBlur={onBlur}
        style={styles.picker}>
        {getAvailableUnits(group).map(unit => (
          <Picker.Item
            key={unit}
            value={unit}
            label={`${translateUnit(unit)}   ( ${getUnitAbbrevation(unit)} )`}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerItem: {
    backgroundColor: '#4a4a4a',
    color: '#fff',
  },
  picker: {
    marginHorizontal: 10,
  },
});

function getAllUnits() {
  return Object.values(Unit);
}

function getAvailableUnits(group?: UnitGroup) {
  if (group) {
    const available = unitGroupsMap.get(group);

    return available ?? getAllUnits();
  }

  return getAllUnits();
}
