/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  Button,
  StatusBar,
  useColorScheme,
  StyleSheet,
  Alert,
  Linking,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const camera = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');

  const devices = useCameraDevices();
  const frontDevice = devices.front;
  const backDevice = devices.back;
  const cameraDevices = [frontDevice, backDevice];

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    return newCameraPermission;
  };

  const handleOpenCamera = async () => {
    const permission = await getPermission();

    if (!cameraDevices || permission !== 'authorized') {
      return <Text>Camera not available</Text>;
    }

    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);
      setShowCamera(false);
      console.log(photo.path);
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {showCamera ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={frontDevice!}
            isActive={showCamera}
            photo={true}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => capturePhoto()}
            />
          </View>
        </>
      ) : (
        <>
          {imageSource !== '' ? (
            <>
              <Image
                style={styles.image}
                source={{
                  uri: `file://'${imageSource}`,
                }}
              />
              <View style={styles.backButton}>
                <TouchableOpacity
                  style={styles.backButtonTouchable}
                  onPress={() => setShowCamera(true)}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={() => setShowCamera(true)}>
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.usePhotoButton}
                    onPress={() => setShowCamera(true)}>
                    <Text style={styles.usePhotoText}>Use Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <Button title="Camera" color="grey" onPress={handleOpenCamera} />
          )}
        </>
      )}
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
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    //ADD backgroundColor COLOR GREY
    backgroundColor: '#B2BEB5',

    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButtonTouchable: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    width: 100,
  },
  backButtonText: {color: 'white', fontWeight: '500'},
  retakeButton: {
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#77c3ec',
  },
  retakeText: {color: '#77c3ec', fontWeight: '500'},
  usePhotoButton: {
    backgroundColor: '#77c3ec',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  usePhotoText: {color: 'white', fontWeight: '500'},
});
