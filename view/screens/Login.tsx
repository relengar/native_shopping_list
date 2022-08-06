import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import {useForm, Controller} from 'react-hook-form';
import {Store} from '../../providers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenName} from '../navigation';
import {Services} from '../../providers/serviceProvider';

type LoginData = {
  username: string;
  password: string;
};

export const Login: React.FC<{navigation: NativeStackNavigationProp<any>}> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginData>();

  const {setCurrentUser} = useContext(Store);
  const {authHttpClient} = useContext(Services);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setErrorMessage(null);
      } else {
        setErrorMessage('Missing internet connection');
      }
    });

    return unsubscribe();
  }, []);

  const handleLogin = async ({username, password}: LoginData) => {
    try {
      setisLoading(true);
      const resp = await authHttpClient.login(username, password);
      setCurrentUser({
        username,
        token: resp.token,
        id: resp.id,
      });
      navigation.navigate(ScreenName.LANDING);
    } catch (error: any) {
      setErrorMessage(error.message);
      setisLoading(false);
    }
  };

  const handleRegister = async ({username, password}: LoginData) => {
    try {
      setisLoading(true);
      const resp = await authHttpClient.register(username, password);
      setCurrentUser({
        username,
        token: resp.token,
        id: resp.id,
      });
    } catch (error: any) {
      setErrorMessage(error.message);
      setisLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            autoCompleteType="username"
            placeholder="Name"
            textContentType="username"
            autoComplete="username"
            autoCapitalize="none"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
        name="username"
      />
      <Text style={styles.formErrorMessage}>
        {errors?.username && 'Invalid username'}
      </Text>
      <Controller
        control={control}
        rules={{
          required: true,
          pattern: /(?=.*[A-z])(?=.*[0-9])/g,
          minLength: 8,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            autoCompleteType="password"
            secureTextEntry={true}
            placeholder="Password"
            textContentType="password"
            autoComplete="password"
            autoCapitalize="none"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
        name="password"
      />
      <Text style={styles.formErrorMessage}>
        {errors?.password && 'Invalid password'}
      </Text>

      <Button
        containerStyle={styles.submitButton}
        disabled={isLoading}
        onPress={handleSubmit(handleLogin)}
        title="Log In"
        accessibilityLabel="Log In"
      />
      <Button
        containerStyle={styles.submitButton}
        disabled={isLoading}
        onPress={handleSubmit(handleRegister)}
        title="Sign Up"
        accessibilityLabel="Sign Up"
      />
      {isLoading && <ActivityIndicator style={styles.spinner} size={'large'} />}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  errorMessage: {
    color: '#eb4034',
    fontSize: 25,
    alignSelf: 'center',
    paddingTop: 15,
  },
  formErrorMessage: {
    color: '#eb4034',
    marginHorizontal: 10,
  },
  spinner: {
    paddingTop: 15,
  },
  submitButton: {
    margin: 10,
  },
});
