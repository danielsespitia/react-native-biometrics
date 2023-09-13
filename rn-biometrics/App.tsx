/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';

import {
  Alert,
  SafeAreaView,
  Button,
  StatusBar,
  useColorScheme,
  StyleSheet,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import ReactNativeBiometrics from 'react-native-biometrics';
import {asyncStoreKeys, asyncGetKeys, onPressDeleteKeys} from './src/utils';
import axios from 'axios';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keysDoExist, setKeysDoExist] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  const doKeysExist = () => {
    try {
      rnBiometrics.biometricKeysExist().then(resultObject => {
        const {keysExist} = resultObject;

        if (keysExist) {
          setKeysDoExist(true);
        } else {
          console.log('-> Keys do not exist');
          setKeysDoExist(false);
        }
      });
    } catch (err: any) {
      Alert.alert('Error', 'Could not verify keys');
      throw new Error(err);
    }
  };

  const onPressAuth = async () => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';

    try {
      await doKeysExist();

      if (!keysDoExist) {
        createKeys();
      }

      createSignature(payload);
    } catch (err: any) {
      Alert.alert('Auth Error', 'There was an issue');
      throw new Error(err);
    }
  };

  const onPressLogout = () => {
    setIsAuthenticated(false);
    Alert.alert('Sesión finalizada', 'Has cerrado sesión');
  };

  const createKeys = async () => {
    // Step 1: Create an assymetric key pair
    rnBiometrics.createKeys().then(async resultObject => {
      const {publicKey} = resultObject;
      Alert.alert('Keys created successfully', `Public Key: ${publicKey}`);
      // Step 2: Enroll the public key
      await asyncStoreKeys(publicKey);
    });
  };

  const verifySignatureWithAsyncStorage = async (
    signature: string,
    payload: string,
  ) => {
    // Step 5: Verify the signed data using public key
    const storedKeys = await asyncGetKeys();

    const data = {
      signature,
      payload,
      publicKey: storedKeys,
    };

    // Step 5: Tell the app verification result
    await verifySignature(data);
  };

  const verifySignature = async (data: any) => {
    const {signature, payload, publicKey} = data;

    await axios
      .post('http://192.168.1.1:8000/verify-signature', {
        signature,
        payload,
        publicKey,
      })
      .then(function (response) {
        setIsAuthenticated(response.data.passed);
      })
      .catch(function (error) {
        console.log(error, 'error');
      });
  };

  const createSignature = async (payload: any) => {
    rnBiometrics
      .createSignature({
        // Step 3: Prompt the user to touch fingerprint
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(async resultObject => {
        const {success, signature} = resultObject;

        if (success) {
          // Step 4: Send the signed piece of data
          verifySignatureWithAsyncStorage(signature!, payload);

          // setIsAuthenticated(true);
          // Alert.alert('Autenticación exitosa', 'Bienvenido!');
          // console.log('successful biometrics provided');
        } else {
          console.log('user cancelled biometric prompt');
        }
      })
      .catch(error => {
        console.log('biometrics failed', error.Error);
      });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {!isAuthenticated ? (
        <Button title="AUTH" onPress={onPressAuth} />
      ) : (
        <Button title="LOGOUT" onPress={onPressLogout} />
      )}
      <Button title="DELETE KEYS" color="red" onPress={onPressDeleteKeys} />
      <Button title="KEYS?" color="grey" onPress={doKeysExist} />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
const ExtraComponents = () => (
  <>
    {/* <Button title="SENSOR?" color="red" onPress={onPressSensor} />
    <Button
        title="VERIFY"
        color="green"
        onPress={() => verifySignature(reqParams)}
      />
     */}
  </>
);
