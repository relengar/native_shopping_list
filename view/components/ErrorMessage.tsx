import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';

type ErrorMessageProps = {
  text?: string | null;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({text}) => {
  return <>{text && <Text style={styles.text}>{text}</Text>}</>;
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    width: 300,
    borderRadius: 7,
    borderColor: '#a6675a',
    borderWidth: 3,
    margin: 2,
    paddingTop: 4,
    color: '#bd2c0f',
    backgroundColor: '#cfaca5',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
  },
});
