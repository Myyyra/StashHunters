import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import FetchStashes from './FetchStashes.js';
import CreateNewStash from './CreateNewStash';
import { useIsFocused } from "@react-navigation/native";
import { rules } from '../GameRules.js';

let done = false;
let lat = 60.201313;
let long = 24.934041;

export default function MapScreen({ navigation, route }) {

    const [stashes, setStashes] = useState([{ title: "preset", latitude: 0, longitude: 0 }]);
    const [foundStashes, setFoundStashes] = useState([{ title: "found preset", latitude: 0, longitude: 0 }]);
    const [hunted, setHunted] = useState({ title: "", latitude: 0, longitude: 0, circleLat: 0, circleLong: 0 });

    const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;

    //Haaga-Helia as a preset for mapview to start from something
    const [region, setRegion] = useState({ latitude: 60.200692, longitude: 24.934302, latitudeDelta: 0.0222, longitudeDelta: 0.0121 });

    const handleLogout = () => {
        firebaseAuth.signOut()
            .then(() => navigation.navigate('Home'))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        const enter = navigation.addListener('focus', () => {
            findLocation();
            compareStashes();
            if (route.params) {
                startHunt();
            }
        });
        return enter;
    }, [navigation]);

    const findLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            await Location.getCurrentPositionAsync({})
                .then(location => {

                    lat = location.coords.latitude;
                    long = location.coords.longitude;

                    if (done === false) {

                        setRegion({ ...region, latitude: lat, longitude: long });

                        done = true;
                    }

                    setTimeout(function () { findLocation(); }, 2000);
                });
        }
    }

    const compareStashes = async () => {

        let all = await FetchStashes.findStashes();

        let found = await FetchStashes.getFoundStashes(currentUser);

        setStashes(compareArrays(found, all).different);
        setFoundStashes(found);
    }

    const compareArrays = (x, y) => {

        let same = [];
        let different = y;

        x.forEach(xItem => {
            if (y.length > 0) {
                y.forEach(yItem => {
                    if (xItem.key === yItem.key) {
                        same.push(xItem);
                        different = different.filter(item => item.key !== xItem.key);
                    }
                })
            }
        });

        return { same: same, different: different };
    }

    const startHunt = async () => {

        let stash = route.params;

        if (compareArrays([stash], await FetchStashes.getFoundStashes(currentUser)).same.length === 0) {
            setHunted(stash);
            Hunt(stash);
            setRegion({
                latitude: stash.latitude,
                longitude: stash.longitude,
                latitudeDelta: 0.0071,
                longitudeDelta: 0.00405
            });
            console.log("start hunting " + stash.title);
        }
    }

    const Hunt = (target) => {

        let found = false;

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

        if (distance < rules.stashFindDist) {
            Alert.alert("You have found " + target.title);
            if (currentUser) {
                stashFound(target);
            }
            setHunted({ title: "", latitude: 0, longitude: 0, circleLat: 0, circleLong: 0 });
            found = true;
            route.params = null;
        }

        if (!found) {
            setTimeout(function () { Hunt(target); }, 2000);
        }
    }

    const stashFound = (stash) => {
        Firebase.database().ref('users/' + firebaseAuth.currentUser.uid + "/foundStashes/" + stash.key).set(
            {
                latitude: stash.latitude,
                longitude: stash.longitude,
                title: stash.title,
                description: stash.description,
                owner: stash.owner,
                disabled: stash.disabled,
                key: stash.key,
                circleLat: stash.circleLat,
                circleLong: stash.circleLong
            }
        );
    }

    //tämän voi ottaa pois kun databasen kaikkien stashien datarakenteesta löytyy circleLat 
    const circleCenter = (target) => {
        if (target.circleLat) {
            return { latitude: target.circleLat, longitude: target.circleLong };
        }
        else {
            return { latitude: target.latitude, longitude: target.longitude };
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.map}>

                <View style={styles.header}>
                    <Text style={styles.hunted}>The Hunted Stash: {hunted.title}</Text>
                    {currentUser ?
                        <Text style={styles.headerText} onPress={handleLogout}>LOGOUT</Text>
                        :
                        <Text style={styles.headerText} onPress={() => navigation.navigate('Home')}>SIGN IN</Text>
                    }
                </View>
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation
                    showsMyLocationButton={true}

                >
                    {stashes.filter(stash => stash.title !== hunted.title)
                        .map((stash, index) => (
                            <View key={index}>


                                <Marker
                                    coordinate={circleCenter(stash)}

                                    title={stash.title}
                                    description={stash.description}
                                    opacity={0.0}
                                    //image={require('../assets/circle.png')}

                                    onPress={() => {
                                        if (hunted.title !== stash.title) {
                                            route.params = null;
                                            navigation.navigate('StashCard', stash);
                                        }
                                    }}
                                />
                                <Circle
                                    center={circleCenter(stash)}
                                    radius={rules.circleRad}
                                    strokeColor={rules.circleColor}
                                    fillColor={rules.circleColor}

                                />

                            </View>
                        )
                        )
                    }

                    {foundStashes.filter(stash => stash.title !== hunted.title)
                        .map((stash, index) => (
                            <View key={index}>
                                <Marker
                                    coordinate={{ latitude: stash.latitude, longitude: stash.longitude }}
                                    title={stash.title}
                                    description={stash.description}
                                    pinColor='green'
                                //image={require('../assets/flag.png')}

                                />
                            </View>
                        )
                        )
                    }

                    <Circle
                        center={circleCenter(hunted)}
                        radius={rules.circleRad}
                        strokeColor='rgba(0, 234, 82, 1)'
                        fillColor='rgba(0, 234, 82, 0.3)'
                    />



                </MapView>

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
    hunted: {
        color: 'white',
        fontSize: 16
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        top: 30
    }
});
