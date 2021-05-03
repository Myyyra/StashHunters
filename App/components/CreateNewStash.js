import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Firebase, { firebaseAuth } from '../config/Firebase';
import FetchStashes from './FetchStashes.js';
import { rules } from '../GameRules.js';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

let lat = '';
let long = '';

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const camera = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [done, setDone] = useState(false);
    const [photoCacheUri, setPhotoCacheUri] = useState(''); // local storage uri after player has taken a picture

    // When this component is on the foreground
    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            checkDistances();
        });
        return enter;
    }, [navigation]);

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, set states back to empty and redirect to map view
    const saveAndRedirect = async () => {
        if(checkAllFieldsFilled()) {
            await saveStash();
           clearFields();
            navigation.navigate('MapScreen');
        } else {
            Alert.alert('Please fill all the fields.');
        }

    }

    // All fields are required for creating a stash.
    const checkAllFieldsFilled = () => {
        if (title.length > 0 && desc.length > 0 && photo !== null) {
            return true;
        } else {
            return false;
        }
    }

    const clearFields = () => {
        setTitle('');
        setDesc('');
        setPhoto(null);
        setDone(false);
        setPhotoCacheUri('');
        lat = '';
        long = '';
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

    // Get stash unique identifier from Firebase database
    const getKey = () => {
        return Firebase.database().ref('stashes/').push().getKey();
    }

    //save the created stash to database
    const saveStash = async () => {
        try {
            let key = getKey(); // get stash' unique key from database 
            let photokey = key // picture's unique name-to-be in cloud storage
            let photoURL = (Firebase.storage().ref().child('images/' + photokey)).toString(); //image's cloud storage address

            let comprImageUri = await manipulateImage(photoCacheUri); // compress image, returns new uri for compressed image

            uploadImage(comprImageUri, photokey)
                .then(console.log('Success uploading the image'))
                .then(() => {
                    console.log('Success in saving picture to storage');
                })
                .catch((error) => {
                    console.log('Error in uploading picture to the storage: ' + error);
                });

            // finally, set all needed data to firebase database
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
                    photoURL: photoURL,
                    created: new Date().toString()
                }
            );

            Alert.alert("Stash saved");

        } catch (error) {
            console.log("Error saving stash " + error);
        }
    }

    //Checks if the are no other stahes too near. GameRules dictate what is too close.
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
                );

                // Compares to GameRules
                if (distance < rules.stashMinDist) {
                    tooClose = true;
                }
            });
        });

        // If player is too close to an existing stash, alert and redirect back to MapScreen.
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

    // Creates a circle around the stash with a randomized origo and makes sure the stash remains inside the circle 
    // i.e. creates a stash area
    const randomCenter = () => {
        let latitude = lat;
        let longitude = long;
        let diff = rules.circleRad * 0.0000081; // constant number was calculated to adjust lat and long numbers to meters

        let x = latitude + (Math.random() * diff);
        let y = longitude + (Math.random() * diff);

        return { latitude: parseFloat(x.toFixed(7)), longitude: parseFloat(y.toFixed(7)) }; // modifies randomized numbers to adhere to convention of showing lat and long with 7 decimal points
    }

    // Launch camera, check if player is satisfied with picture and take a photo snapshot
    const snap = async () => {
        if (camera) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.cancelled) {
                setPhotoCacheUri(result.uri);
                setPhoto(result);
                setDone(true); // When picture is taken succesfully, signals that rendering taken picture to its slot is possible now.
            }
        }
    }

    // Gets image from local cache, transforms to "blob" and uploads to cloud storage.
    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = Firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
    }

    // takes image uri from local cache and returns a new local cache image uri
    const manipulateImage = async (uri) => {
        // ImageManipulator can be used to manipulate an image in many ways. Now, we only compress the image.
        let manipImage = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.5});
        return manipImage.uri;
    }

    //set the header font
    const [fontsLoaded] = useFonts({
        PressStart2P_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style = {styles.header}>
                <Text style={styles.headerFont}>Create new stash</Text>
            </View>
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
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={saveAndRedirect}>
                        <View style={styles.saveBtn}>
                            <Text style={styles.btnText}>Save</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearFields}>
                        <View style={styles.clearBtn}>
                            <Text style={styles.btnText}>Clear</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    headerText: {
        fontSize: 30, 
        fontWeight: 'bold'
    },
    imageContainer: {
        flex: 2,
    },
    inputContainer: {
        flex: 2
    },
    input: {
        flex: 0.5,
        width: 275,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10
    },
    inputBig: {
        flex: 1,
        width: 275,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    },
    image: {        
        flex: 2,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: undefined,
        aspectRatio: 3 / 2,
        resizeMode: 'contain'
    },
    buttons: {

        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end'
    },
    clearBtn: {
        backgroundColor: '#a60225',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center'
    },
    saveBtn: {
        backgroundColor: '#029B76',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
        marginRight: 15
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 20
    }
});