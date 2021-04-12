import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';
import * as Location from 'expo-location';

let done = false;
let lat = 60.201313;
let long = 24.934041;

export default function MapScreen() {

    const [stashes, setStashes] = useState([]);
    //hunted means the stash that the user will try to find
    //this feature is still in progress
    const [hunted, setHunted] = useState([]);
    const { currentUser } = firebaseAuth;

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

    const findLocation = async () => {

        let { status } = await Location.requestPermissionsAsync();
        if (status === 'granted') {
            await Location.getCurrentPositionAsync({})
                .then(location => {
                    //setLatitude(location.coords.latitude);
                    //setLongitude(location.coords.longitude);

                    lat = location.coords.latitude;
                    long = location.coords.longitude;

                    if (done === false) {

                        setRegion({ ...region, latitude: lat, longitude: long });

                        //miksi tämä ei settaa donea trueksi ???

                        done = true;
                    }

                    setTimeout(function () { findLocation(); }, 2000);
                });

            // At the moment user location is tracked at 5 second intervals 
            // still searching for better way to track user location in real time
            // react native geolocation service maybe??
        }
    }


    useEffect(() => {
        getStashes();
        findLocation();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.map}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{currentUser.displayName}</Text>
                    <Text style={styles.headerText} onPress={handleLogout}>LOGOUT</Text>
                </View>
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation
                    followsUserLocation={true}
                    showsMyLocationButton={true} >

                    {stashes.map((stash, index) => (

                        <Marker
                            key={index}

                            coordinate={{ latitude: parseFloat(stash.latitude), longitude: parseFloat(stash.longitude) }}

                            title={stash.title}
                            description={stash.description}

                            image={require('../assets/flag.png')}

                            onPress={() => setHunted(stash)}
                        />
                    ))}

                </MapView>

                <View>
                    <Text>The Hunted Stash: {hunted.title}</Text>
                </View>

                <StatusBar style="auto" />
            </View>
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
