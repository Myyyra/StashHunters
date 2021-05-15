import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';
import StashHandling from './StashHandling';
import LocationActions from './LocationActions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

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
            atStart();
        });
        return enter;
    }, [navigation]);

    //Checks if the are no other stahes too near. GameRules dictate what is too close.
    const atStart = async () => {
        let stashes = await StashHandling.getAllStashes();

        let location = await LocationActions.findLocation()

        if (LocationActions.checkIfTooClose(stashes, location)) {
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
        } else {
            Alert.alert('Your stash will be created to this location', `Please don't move until you have saved the stash`);
        }
    }

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, set states back to empty and redirect to map view
    const saveAndRedirect = async () => {
        if (checkAllFieldsFilled()) {
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
        }
        return false;
    }

    const clearFields = () => {
        setTitle('');
        setDesc('');
        setPhoto(null);
        setDone(false);
        setPhotoCacheUri('');
    }

    //save the created stash to database
    const saveStash = async () => {
        try {
            let key = StashHandling.getKey(); // get stash' unique key from database 
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

            let location = await LocationActions.findLocation();

            // finally, set all needed data to firebase database
            let currentUser = firebaseAuth.currentUser;
            let newStash = {
                latitude: location.latitude,
                longitude: location.longitude,
                title: title,
                description: desc,
                owner: currentUser,
                disabled: false,
                key: key,
                photoURL: photoURL
            }
            StashHandling.saveStash(newStash, currentUser);

            Alert.alert("Stash saved");

        } catch (error) {
            console.log("Error saving stash " + error);
        }
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
        let manipImage = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.5 });
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
            <View style={styles.header}>
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
        margin: 10,
        fontSize: 20,
        borderRadius: 5
    },
    inputBig: {
        flex: 1,
        width: 275,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10,
        fontSize: 20,
        borderRadius: 5
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