import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button } from 'react-native';
import { Camera } from 'expo-camera';
import Firebase from '../config/Firebase';

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
            savePicture();
        }
    }

    // Ei toimi vielä
    const savePicture = () => {
        const metadata = { contentType: 'image/base64' }
        const storageRef = Firebase.storage().ref();
        const uploadTask = storageRef.child(`stashpictures/${photoName}`).set(photoBase64, metadata);
        uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
                case Firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case Firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, error => {
            console.log('Nyt kävi köpelösti: ' + error);
        }, () => {
            // upload finished with success, you can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                console.log(downloadURL);
            });
        })
    }


    return (
        <View style={styles.container}>

            { hasCameraPermission ?
                (
                    <View>
                        <Camera style={{ flex: 4 }} ref={camera} />
                        <View>
                            <Button title="Take a picture" onPress={snap} />

                        </View>
                        <View>
                            <Image source={{ uri: photoName }} />
                            <Image source={{ uri: `data:image/gif;base64,${photoBase64}` }} />
                        </View>
                    </View>

                ) : (

                    <View style={styles.container}>
                        <Text>No access to camera!</Text>
                        <Button title='Back' onPress={() => navigation.goBack()} />
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //...StyleSheet.absoluteFillObject,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});