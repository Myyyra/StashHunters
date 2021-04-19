import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { Camera } from 'expo-camera';
import Firebase, { firebaseAuth } from '../config/Firebase';

let lat = 60.201313;
let long = 24.934041;

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [stashes, setStashes] = useState([]);

    //initialize camera functions
    const [hasCameraPermission, setPermission] = useState(null);
    const [photoName, setPhotoName] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const [type, setType] = useState(Camera.Constants.Type.back);
    const camera = useRef(null);

    useEffect(() => {
        getStashes();
        findLocation();
        //askCameraPermission();
    }, []);

    useEffect(() => {
        (async () => {
            console.log('tarkistetaan kamerankäyttöoikeus');
          const { camStatus } = await Camera.requestPermissionsAsync();
          console.log('status on ' + camStatus);
          setPermission(camStatus === 'granted');
        })();
      }, []);

    
    const askCameraPermission = async () => {
        const { camStatus } = await Camera.requestPermissionsAsync();
        setPermission(camStatus === 'granted');
        
    }
    
    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setPhotoName(photo.uri);
            setPhotoBase64(photo.base64);
        }
    }

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = () => {
        saveStash();
        setTitle('');
        setDesc('');
        lat = '';
        long = '';
        navigation.navigate('MapScreen');
    }

    const findLocation = async () => {

        let { status } = await Location.requestPermissionsAsync();

        if (status === 'granted') {
            await Location.getCurrentPositionAsync({})
                .then(location => {
                    lat = location.coords.latitude;
                    long = location.coords.longitude;
                });
        }
    }

    //save the created stash to database
    //checks if the are no other stahes too near
    const saveStash = () => {

        getStashes();
        findLocation().then(() => {

            let tooClose = false;
            stashes.forEach(stash => {

                //distance between stash and user location in meters
                let distance = getDistance(
                    {
                        //user location
                        latitude: lat,
                        longitude: long,
                    },
                    {
                        //compared stash location
                        latitude: stash.latitude,
                        longitude: stash.longitude,
                    }
                )

                //muokkaa tänne parempi etäissyy arvo kun tarttee
                //lähin testattu piilo oli 35 metrin päässä 
                if (distance < 34) {
                    Alert.alert("There is another Stash too close");
                    tooClose = true;
                }

            })

            //if there is no close stashes save location to firebase
            if (tooClose === false) {
                try {
                    let key = getKey();
                    console.log(key);

                    Firebase.database().ref('stashes/' + key).set(
                        {
                            latitude: lat,
                            longitude: long,
                            title: title,
                            description: desc,
                            owner: firebaseAuth.currentUser.uid,
                            disabled: false,
                            key: key
                        }
                    );

                    Alert.alert("Stash saved");

                } catch (error) {
                    console.log("Error saving stash " + error);
                }
            }
        });
    }

    const getKey = () => {
        return Firebase.database().ref('stashes/').push().getKey();
    }

    const getStashes = () => {
        try {
            Firebase.database()
                .ref('/stashes')
                .on('value', snapshot => {
                    const data = snapshot.val();
                    const s = Object.values(data);
                    setStashes(s);
                });
        } catch (error) {
            console.log("Error at getting stashes from firebase " + error);
        }
    }

    if (hasCameraPermission === null) {
        return <View />;
      }
      if (hasCameraPermission === false) {
        return (
        <View style={styles.container}>
            <Text>No access to camera</Text>
            <Button title='Muokkaa lupaa' onPress={() => askCameraPermission()}/>
        </View>);
    }

    return (
        <View>
                    <View style={styles.container}>
                        <Text>Create new stash</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTitle}
                            value={title}
                            placeholder='Stash name'
                        />
                        <TextInput
                            multiline
                            numberOfLines={4}
                            style={styles.inputBig}
                            onChangeText={setDesc}
                            value={desc}
                            placeholder='Description'
                        />

                        <Camera ref={camera} type={type} />
                        <Button
                            title='Take a picture'
                            onPress={snap} />

                        <Image source={{ uri: photoName }} />
                        <Image source={{ uri: `data:image/gif;base64, ${photoBase64}` }} />

                        <Button
                            onPress={saveAndRedirect}
                            title="Save"
                            color='#029B76'
                        />

                    </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    input: {
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10
    },
    inputBig: {
        width: 200,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    }
});