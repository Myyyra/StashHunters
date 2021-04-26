import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Firebase, { firebaseAuth } from '../config/Firebase';
import FetchStashes from './FetchStashes.js';
import { rules } from '../GameRules.js';

let lat = '';
let long = '';

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [stashes, setStashes] = useState([]);


    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = async () => {
        await saveStash();
        setTitle('');
        setDesc('');
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

        let results = await FetchStashes.findStashes();
        setStashes(results);

        await findLocation().then(() => {

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
                            circleLong: randomCenter().longitude
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


    const randomCenter = () => {

        let latitude = lat;
        let longitude = long;
        let diff = rules.circleRad * 0.0000081;

        let x = latitude + (Math.random() * diff);
        let y = longitude + (Math.random() * diff);

        return { latitude: parseFloat(x.toFixed(7)), longitude: parseFloat(y.toFixed(7)) };
    }


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



            <Button
                onPress={() => navigation.navigate('CameraScreen')}
                title="Take a picture"
                color='#029B76'
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