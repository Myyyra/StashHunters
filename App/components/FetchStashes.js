import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
//import * as firebase from 'firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CreateNewStash from './CreateNewStash';
import Firebase from '../config/Firebase';
/*
//TODO: encrypt
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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
} 
*/
//tänne tuodaan myöhemmin toimiva versio mapscreenistä löytyvästä saman nimisestä funktiosta
const firebase = Firebase;
function FetchStashes() {
  
    const [locations, setLocations] = useState([]);

    firebase.database()
        .ref('/stashes/-MVGKSMRr2ArPReUCVFp')
        .once('value')
        .then(snapshot => {
          Alert.alert(">>" + snapshot.val().latlong.latitude);
        });

    return locations;
}