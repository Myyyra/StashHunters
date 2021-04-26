import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button } from 'react-native';
import { Camera } from 'expo-camera';
import Firebase from '../config/Firebase';
import * as ImagePicker from 'expo-image-picker';



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


    const askCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setPermission(status === 'granted');

    }


    const snap = async () => {
        if (camera) {
            let result = await ImagePicker.launchCameraAsync();
            //let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.cancelled) {
            this.uploadImage(result.uri, "test-image")
            .then(console.log('result uri: ' + result.uri))
            .then(() => {
            Alert.alert("Success");
            return result.uri
            })
            .catch((error) => {
                Alert.alert(error);
            });
            }
        }
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
    
        let ref = Firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
      }

    return (
        <View style={styles.container}>

            { hasCameraPermission ?
                (
                    <View style= {styles.container}>
                        <View style= {styles.container}>
                            <Button title="Take a picture" onPress={snap} />
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
        flex:1, 
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});