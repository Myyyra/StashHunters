import React, {useState} from 'react';
import { Alert } from 'react-native';
//import * as firebase from 'firebase';
import Firebase from '../config/Firebase';

const fb = Firebase;

//tänne tuodaan myöhemmin toimiva versio mapscreenistä löytyvästä saman nimisestä funktiosta

function FetchStashes() {
  
    const [locations, setLocations] = useState([]);

    fb.database()
        .ref('/stashes/-MVGKSMRr2ArPReUCVFp')
        .once('value')
        .then(snapshot => {
          Alert.alert(">>" + snapshot.val().latlong.latitude);
        });

    return locations;
}