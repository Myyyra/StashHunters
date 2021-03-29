import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import * as firebase from 'firebase';
import * as Location from 'expo-location';

const firebaseConfig = {
    apiKey: "AIzaSyAVAQVZTPJGg4LcRsOe2-jOv9iL_D2l03A",
    authDomain: "stashhunters.firebaseapp.com",
    databaseURL: "https://stashhunters-default-rtdb.firebaseio.com",
    projectId: "stashhunters",
    storageBucket: "stashhunters.appspot.com",
    messagingSenderId: "220185997672",
    appId: "1:220185997672:web:4c44ff88c7def725a9e6dd",
    measurementId: "G-NEN89Q25YP"
};

//initialize connection to database
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState(60.201313);
    const [longitude, setLongitude] = useState(24.934041);

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = () => {
        saveStash();
        Alert.alert("Stash saved");
        setTitle('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        navigation.navigate('MapScreen');
    }

    const findLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
    }

    //save the created stash to database
    const saveStash = () => {
        firebase.database().ref('stashes/').push(
            {
                latitude: latitude,
                longitude: longitude,
                title: title,
                description: desc
            }
        );
    }

    useEffect(() => {
        findLocation()
    }, []);

    return (
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
                numberOfLines={3}
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
    },
});