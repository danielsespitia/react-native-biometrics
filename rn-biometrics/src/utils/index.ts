import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
export const asyncStoreKeys = async (keys: string) => {
  try {
    await AsyncStorage.setItem('keys', JSON.stringify(keys));
    console.log('Keys stored successfully');
  } catch (error) {
    console.log(error);
  }
};

export const asyncGetKeys = async () => {
  try {
    const savedKeys: any = await AsyncStorage.getItem('keys');
    const currentKeys = JSON.parse(savedKeys);
    console.log('storedKeys:', currentKeys);
    return currentKeys;
  } catch (error) {
    console.log(error);
  }
};

export const onPressSensorAvailable = () => {
  rnBiometrics.isSensorAvailable().then(resultObject => {
    const {available, biometryType} = resultObject;

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported');
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported');
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported');
    } else {
      console.log('Biometrics not supported');
    }
  });
};

export const onPressDeleteKeys = () => {
  rnBiometrics.deleteKeys().then(resultObject => {
    const {keysDeleted} = resultObject;

    if (keysDeleted) {
      Alert.alert('Success', 'Successful deletion');
    } else {
      Alert.alert(
        'Error',
        'Unsuccessful deletion because there were no keys to delete',
      );
    }
  });
};

const reqParams = {
  payload: '1693326972some message',
  publicKey:
    'yW+zJBX099Xgt/VsVGXuuH2LVzZcbFpw/tjXWVADOISCdQkebMK8CTnNmboRUQpobIB+JobH7JbTr8KxAaQkYhz09RphRdrTrte21ow/pkpcOB4tcP1eJhgM7kgLOl8Z9ygfBHVyksh32LFpFFZowYcklZHwdFurJke2uR7wVKTIH2qx4VFCV8k9YhbUfhJoGSOknTSnYSz0jAJT293Q967ExQUYPTFCzJa4vJFN6DiQUkCLmBPO8pvLnoJCT42Qr+he9TYuGD/zocSRNejP2iopksq1VoRN0SRy1w4O4H3g3SqrRmmF0Wn3nsqKapsksZsYDR17G3wG04lzfVBqUw==',
  signature:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzraDLPYULRFTxEG7BJ2aJk+8BeSkLjCOgV491DgOaDzqqwbt+OQg3n5CdN+difejUbLUfNJUYdWk8cfrJh92/rG+gY0ECcTC5GObSqEYsKDcUc3lYJ56QcXzsOoJPQJMxkEz9+Zc2c03LzV2h50gQjowvjjCUWlxTHU2zLHT3GFQXsZfeub8Ov3CeusgjKw/v2pyc2fV7QEXs9k8SpBO8Lp6Sa0q6jg0GE42oAsZx0Y3FugDz0fmJNVnPvoGJTUGpHpsPNFy6QoU65SY5vXUhuISoMuDtBSlDAVRGFFRAHqfSKQxqyxvQSwnNYVVtopkpmBX1Ucozya8jVSTB24trQIDAQAB',
};

const {payload, publicKey, signature} = reqParams;

// const verifySignature = await axios({
//   method: 'post',
//   url: 'http://localhost:8000/verify-signature',
//   data: {
//     signature,
//     payload,
//     publicKey: storedKeys,
//   },
// });

// const data = {
//   signature,
//   payload,
//   publicKey: storedKeys,
// };

// const url = 'http://localhost:8000/verify-signature';

// const response = await fetch(url, {
//   method: 'POST', // *GET, POST, PUT, DELETE, etc.
//   mode: 'cors', // no-cors, *cors, same-origin
//   credentials: 'same-origin', // include, *same-origin, omit
//   headers: {
//     'Content-Type': 'application/json',
//     // 'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   body: JSON.stringify(data), // body data type must match "Content-Type" header
// });

// const result = response.json();

// // Step 5: Tell the app verification result
// console.log(result);

// const verifySignatureWithPublicKey = (signature, payload) => {
//   try {
//     // use React Native Crypto
//     const verifier = crypto.createVerify('SHA256');
//     verifier.update(payload);

//     const isSignatureValid = verifier.verify(publicKey, signature, 'base64');

//     if (isSignatureValid) {
//       console.log('Signature verification succeeded.');
//     } else {
//       console.log('Signature verification failed.');
//     }
//   } catch (error) {
//     console.error('Error verifying signature:', error);
//   }
// };
