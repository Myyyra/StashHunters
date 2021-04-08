import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Firebase from '../config/Firebase';
import * as Location from 'expo-location';

let done = false;
let lat = 60.201313;
let long = 24.934041;

export default function MapScreen() {

    const [stashes, setStashes] = useState([]);
    //hunted means the stash that the user will try to find
    //this feature is still in progress
    const [hunted, setHunted] = useState([]);

    //Haaga-Helia as a preset for mapview to start from something
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121
    });

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

    /* Region <- ???
        At the moment region returns the mapview to user location everytime findLocation() is called.
        This is unwanted and will be fixed when we find solution. 
        It should center to users location only when user opens mapview
    */
    return (
        <View style={styles.map}>

            <MapView
                style={styles.map}
                region={region}
                showsUserLocation
                followsUserLocation={true}
                showsMyLocationButton={true}
            >



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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});


