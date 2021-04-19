import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';


let done = false;
let lat = 60.201313;
let long = 24.934041;
let circleRad = 50;
let circleColor = 'rgba(252, 138, 7, 0.35)';
let centered = false;

export default function MapScreen({ navigation }) {

    const [userLocation, setUserLocation] = useState([]);
    const [stashes, setStashes] = useState([]);
    const [hunted, setHunted] = useState({
        title: "",
        latitude: 0,
        longitude: 0
    });
    //hunted means the stash that the user will try to find
    //this feature is still in progress
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

        if (!centered) {

            centered = true;

            setHunted(target);

            setRegion({
                latitude: target.latitude,
                longitude: target.longitude,
                latitudeDelta: 0.0071,
                longitudeDelta: 0.00405
            });
        }


        let found = false;

        if (hunted !== NaN) {
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
            if (distance < 10) {
                Alert.alert("You have found " + target.title);
                setHunted({ title: "" });
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
                    const filtered = s.filter(stash => stash.disabled === false);
                    setStashes(filtered);
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

    //Tästä voi olla hyötyä 
    // että voidaan mitata oikea määrä kordinaatteja 
    //ATM mittaa kahden pisteen välimatkan
    //muokkaa että antaa kordinaatteina tai 
    //suhdeukuna paljonko se pitäisi olla
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    //Ei vielä palauta random lokaatiota?
    const randomCenter = (stash) => {

        let latitude = stash.latitude;
        let longitude = stash.longitude;
        let diff = circleRad * 0.0000081;

        let x = latitude + (Math.random() * (diff - (-diff) - diff));
        let y = longitude + (Math.random() * (diff - (-diff) - diff));

        return { latitude: x, longitude: y };
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
                showsMyLocationButton={true}

            >
                <Marker
                    title="hunted"
                    coordinate={{ latitude: hunted.latitude, longitude: hunted.longitude }}
                    pinColor='rgba(0, 234, 82, 1)'
                />
                <Circle
                    center={randomCenter(hunted)}
                    radius={circleRad}
                    strokeColor='rgba(0, 234, 82, 1)'
                    fillColor='rgba(0, 234, 82, 0.3)'

                />

                {stashes.filter(stash => stash.title !== hunted.title)
                    .map((stash, index) => (
                        <View key={index}>


                            <Marker
                                coordinate={{ latitude: stash.latitude, longitude: stash.longitude }}

                                title={stash.title}
                                description={stash.description}

                                //image={require('../assets/flag.png')}

                                onPress={() => {
                                    if (hunted.title !== stash.title) {
                                        Alert.alert(
                                            "Do you want to start hunting this Stash?",
                                            "",
                                            [
                                                {
                                                    text: "Yes",
                                                    onPress: () => {
                                                        centered = false;
                                                        Hunt(stash);
                                                    }
                                                },
                                                {
                                                    text: "No"
                                                }
                                            ],
                                            {
                                                cancelable: true
                                            }
                                        )
                                    }
                                }}
                            />
                            <Circle
                                center={randomCenter(stash)}
                                radius={circleRad}
                                strokeColor={circleColor}
                                fillColor={circleColor}

                            />

                        </View>
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
    }
});
