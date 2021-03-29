import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
//import * as firebase from 'firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CreateNewStash from './CreateNewStash';
import Firebase from '../config/Firebase';

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