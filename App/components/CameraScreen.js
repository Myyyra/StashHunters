import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import { Camera } from 'expo-camera';



export default function CameraScreen({ navigation }) {


  //initialize camera functions
  const [hasCameraPermission, setPermission] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [type, setType] = useState(Camera.Constants.Type.back);
  const camera = useRef(null);

  useEffect(() => {
    askCameraPermission();
  }, []);


  /*useEffect(() => {
    (async () => {
      console.log('tarkistetaan kamerankäyttöoikeus');
      const { camStatus } = await Permissions.askAsync(Permissions.CAMERA);
      console.log('status on ' + camStatus);
      setPermission(camStatus === 'granted');
    })();
  }, []);
*/


  const askCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setPermission(status === 'granted');

  }

  const snap = async () => {
    if (camera) {
      let photo = await camera.current.takePictureAsync({ base64: true });
      setPhotoName(photo.uri);
      setPhotoBase64(photo.base64);
    }
  }


  return (
    <View style={styles.container}>

      { hasCameraPermission ?
        (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 4 }} ref={camera} />
            <View>
              <Button title="Take a picture" onPress={snap} />
            </View>
            <View style={{ flex: 4 }}>
              <Image style={{ flex: 1 }} source={{ uri: photoName }} />
              <Image style={{ flex: 1 }} source={{ uri: `data:image/gif;base64,${photoBase64}` }} />
            </View>
          </View>

        ) : (

          <View style={styles.container}>
            <Text>No access to camera, fuck off!</Text>
            <Button title='Back' onPress={() => navigation.goBack()} />
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
  }
});