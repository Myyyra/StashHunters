import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Firebase, { firebaseAuth } from '../config/Firebase';
import FetchStashes from './FetchStashes.js';
import { rules } from '../GameRules.js';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useIsFocused } from "@react-navigation/native";

let lat = '';
let long = '';

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const camera = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [done, setDone] = useState(false);
    const [photoCacheUri, setPhotoCacheUri] = useState('');


    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = async () => {
        await saveStash();
        setTitle('');
        setDesc('');
        setPhoto(null);
        setDone(false);
        lat = '';
        long = '';
        navigation.navigate('MapScreen');
    }

    const findLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();

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
    const saveStash = async () => {
        try {
            let key = getKey();
            let photokey = key //picture's name in storage
            let photoURL = (Firebase.storage().ref().child('images/' + photokey)).toString();

            let comprImageUri = await manipulateImage(photoCacheUri);
            uploadImage(comprImageUri, photokey)
                .then(console.log('Success uploading the image'))
                .then(() => {
                    console.log('Success in saving picture to storage');
                })
                .catch((error) => {
                    console.log('Error in uploading picture to the storage: ' + error);
                });

            Firebase.database().ref('stashes/' + key).set(
                {
                    latitude: lat,
                    longitude: long,
                    title: title,
                    description: desc,
                    owner: firebaseAuth.currentUser.uid,
                    disabled: false,
                    key: key,
                    circleLat: randomCenter().latitude,
                    circleLong: randomCenter().longitude,
                    photoURL: photoURL
                }
            );

            Alert.alert("Stash saved");

        } catch (error) {
            console.log("Error saving stash " + error);
        }
    }

    const checkDistances = async () => {

        let stashes = await FetchStashes.findStashes();

        let tooClose = false;

        await findLocation().then(() => {

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
                if (distance < rules.stashMinDist) {

                    tooClose = true;
                }
            });


        });

        if (tooClose) {
            Alert.alert(
                "Stash too close!",
                "You need to be further away from another stash.",
                [
                    {
                        text: "Ok",
                        onPress: () => navigation.navigate('MapScreen'),
                        style: "cancel",
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () => navigation.navigate('MapScreen')
                }
            );
        }
    }

    const getKey = () => {
        return Firebase.database().ref('stashes/').push().getKey();
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        checkDistances();
    }, [isFocused]);


    const randomCenter = () => {

        let latitude = lat;
        let longitude = long;
        let diff = rules.circleRad * 0.0000081;

        let x = latitude + (Math.random() * diff);
        let y = longitude + (Math.random() * diff);

        return { latitude: parseFloat(x.toFixed(7)), longitude: parseFloat(y.toFixed(7)) };
    }

    const snap = async () => {
        if (camera) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.cancelled) {
                setPhotoCacheUri(result.uri);
                setPhoto(result);
                setDone(true);
            }
        }
    }

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = Firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
    }

    const manipulateImage = async (uri) => {
        console.log('image to be manipulated: ' + uri);
        let manipImage = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.5});
        console.log('image that has been manipulated: ' + manipImage.uri);
        return manipImage.uri;
    }

    useEffect

    return (
        <View style={styles.container}>
            <Text>Create new stash</Text>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={snap}>
                    {done ?
                        <View style={styles.image}>
                            <Image source={photo} style={styles.image} />
                        </View>
                        :
                        <Image source={require('../assets/no-image-icon.png')} style={styles.image} />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
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
        marginTop: 20,
        flex: 1,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1
    },
    inputContainer: {
        flex: 1
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
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 3 / 2,
        resizeMode: 'contain'
    },
});