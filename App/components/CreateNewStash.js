import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState(60.201313);
    const [longitude, setLongitude] = useState(24.934041);
    const [stashes, setStashes] = useState([]);

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = () => {
        saveStash();
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
    //checks if the are no other stahes too near
    const saveStash = () => {

        getStashes();
        findLocation();

        let tooClose = false;
        stashes.forEach(stash => {

            //distance between stash and user location in meters
            let distance = getDistance(
                {
                    //user location
                    latitude: latitude,
                    longitude: longitude,
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
                Firebase.database().ref('stashes/').push(
                    {
                        latitude: latitude,
                        longitude: longitude,
                        title: title,
                        description: desc,
                        owner: firebaseAuth.currentUser.uid,
                        disabled: false
                    }
                );
                Alert.alert("Stash saved");
            } catch (error) {
                console.log("Error saving stash " + error);
            }
        }
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

    useEffect(() => {
        getStashes();
        findLocation();
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
                numberOfLines={4}
                style={styles.inputBig}
                onChangeText={setDesc}
                value={desc}
                placeholder='Description'
            />

            <TextInput
                style={styles.input}
                onChangeText={setLatitude}
                value={latitude}
                placeholder='Latitude'
            />

            <TextInput
                style={styles.input}
                onChangeText={setLongitude}
                value={longitude}
                placeholder='Longitude'
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
    }
});