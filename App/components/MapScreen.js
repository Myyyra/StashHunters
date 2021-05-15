import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { getDistance } from 'geolib';
import StashHandling from './StashHandling.js';
import LocationActions from './LocationActions';
import { useIsFocused } from "@react-navigation/native";
import { rules } from '../GameRules.js';


export default function MapScreen({ navigation, route }) {

    const [stashes, setStashes] = useState([{ title: "preset", latitude: 0, longitude: 0 }]);
    const [foundStashes, setFoundStashes] = useState([{ title: "found preset", latitude: 0, longitude: 0 }]);
    const [hunted, setHunted] = useState({ title: "", latitude: 0, longitude: 0, circleLat: 0, circleLong: 0 });
    const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;

    const [region, setRegion] = useState({});

    const handleLogout = () => {
        firebaseAuth.signOut()
            .then(() => navigation.navigate('Home'))
            .catch(error => console.log(error));
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        atStart();
    }, [isFocused, hunted]);

    const atStart = async () => {

        setStashes(await StashHandling.getAllNonfoundStashes(currentUser));
        setFoundStashes(await StashHandling.getFoundStashes(currentUser));

        //if there is stash to hunt center view to hunted stash
        if (route.params) {
            //startHunt(route.params);
            setHunted(route.params);
            setRegion({ latitude: route.params.latitude, longitude: route.params.longitude, latitudeDelta: 0.0071, longitudeDelta: 0.00405 });
        }
        //center view to player location if there is no stash to hunt
        else {
            let location = await LocationActions.findLocation();
            setRegion({ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.0071, longitudeDelta: 0.00405 });
        }
    }

    const onLocationChange = async () => {
        if (hunted) {
            if (await checkIfInRadius(hunted, rules.stashFindDist)) {

                let foundStash = hunted;
                setHunted({ title: "", latitude: 0, longitude: 0, circleLat: 0, circleLong: 0 });
                route.params = null;

                if (currentUser !== null) {
                    Alert.alert("You have found the Stash!");

                    StashHandling.saveFoundToUser(foundStash, currentUser);

                    navigation.navigate('StashCard', foundStash);
                }
                else {
                    Alert.alert(
                        "You have found the Stash",
                        "But you need to be signed in to register your finding."
                    );
                }
            }
        }
    };

    const checkIfInRadius = async (target, radius) => {

        let location = await LocationActions.findLocation();

        let distance = getDistance(
            {
                //user location
                latitude: location.latitude,
                longitude: location.longitude
            },
            {
                //compared stash location
                latitude: target.latitude,
                longitude: target.longitude
            }
        )
        if (distance <= radius) {
            return true;
        }
        else {
            return false;
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
                    <Text style={styles.hunted}>Hunting: {hunted.title}</Text>
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
                    onUserLocationChange={onLocationChange}
                >
                    {stashes.filter(stash => stash.title !== hunted.title)
                        .map((stash, index) => (
                            <View key={index}>
                                <Marker
                                    coordinate={circleCenter(stash)}
                                    opacity={0.0}
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
