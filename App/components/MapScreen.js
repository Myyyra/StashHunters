import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

let done = false;
let lat = 60.201313;
let long = 24.934041;

export default function MapScreen({ navigation }) {

    const [userLocation, setUserLocation] = useState([]);
    const [stashes, setStashes] = useState([]);
    //hunted means the stash that the user will try to find
    //this feature is still in progress
    const [hunted, setHunted] = useState([]);
    const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;

    //Haaga-Helia as a preset for mapview to start from something
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121
    });


    const handleLogout = () => {
        firebaseAuth.signOut()
            .then(() => navigation.navigate('Home'))
            .catch(error => console.log(error));
    }

    const Hunt = (target) => {

        let found = false;

        if (hunted !== null) {
            let distance = getDistance(
                {
                    //user location
                    latitude: lat,
                    longitude: long,
                },
                {
                    //compared stash location
                    latitude: target.latitude,
                    longitude: target.longitude,
                }
            )
            if (distance < 5) {
                Alert.alert("You have found " + target.title);
                setHunted([]);
                found = true;
            }
        }

        if (!found) {
            setTimeout(function () { Hunt(target); }, 2000);
        }
    }

    const getStashes = async () => {
        try {
            await Firebase.database()
                .ref('/stashes')
                .on('value', snapshot => {
                    const data = snapshot.val();
                    const s = Object.values(data);
                    setStashes(s);
                });
        } catch (error) {
            console.log("ALERT! Error finding stashes " + error)
        }
    }

    useEffect(() => {
        getStashes();
        getUsers();
        findLocation();
    }, []);

    const getUsers = async () => {

        if (currentUser) {
            try {
            await Firebase.database()
                .ref('/users')
                .on('value', snapshot => {
                    const data = snapshot.val();
                    const users = Object.keys(data);
                    let userExists = users.filter(u => u == currentUser.uid);

                    if (currentUser.uid !== userExists[0]) {
                        createUserToDatabase();
                    }
                });
        } catch (error) {
            console.log("Error fetching user " + error)
        }
        }
    }

    const createUserToDatabase = () => {
        try {
            Firebase.database().ref('users/' + currentUser.uid).set({ username: currentUser.displayName });

            Alert.alert("User saved");
        } catch (error) {
            console.log("Error saving user " + error);
        }
    }

    const findLocation = async () => {

        let { status } = await Location.requestPermissionsAsync();
        if (status === 'granted') {
            await Location.getCurrentPositionAsync({})
                .then(location => {

                    //setUserLocation(location.coords.latitude, location.coords.longitude);

                    lat = location.coords.latitude;
                    long = location.coords.longitude;

                    if (done === false) {

                        setRegion({ ...region, latitude: lat, longitude: long });

                        done = true;
                    }

                    setTimeout(function () { findLocation(); }, 2000);
                });

            // At the moment user location is tracked at 5 second intervals 
            // still searching for better way to track user location in real time
            // react native geolocation service maybe??
        }
    }


    return (
        <View style={styles.container}>
            {currentUser ?
                <View style={styles.header}>
                    <Text style={styles.headerText}>{currentUser.displayName}</Text>
                    <Text style={styles.headerText} onPress={handleLogout}>LOGOUT</Text>
                </View>
                :
                <View style={styles.header}>
                    <Text style={styles.headerText}>anonymous</Text>
                    <Text style={styles.headerText} onPress={() => navigation.navigate('Home')}>SIGN IN</Text>
                </View>
            }
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation
                showsMyLocationButton={true} >

                {stashes.map((stash, index) => (

                    <Marker
                        key={index}

                        coordinate={{ latitude: parseFloat(stash.latitude), longitude: parseFloat(stash.longitude) }}

                        title={stash.title}
                        description={stash.description}

                        //image={require('../assets/flag.png')}

                        onPress={() => {
                            Hunt(stash);
                            setHunted(stash);
                        }}
                    />
                ))}

            </MapView>

            <View>
                <Text>The Hunted Stash: {hunted.title}</Text>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#029B76',
        height: 30,
        padding: 5
    },
    headerText: {
        color: 'white',
        fontSize: 20
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 30
    },
});
