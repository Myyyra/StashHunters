import React, { useState } from 'react';
import { Alert } from 'react-native';
import Firebase from '../config/Firebase';

//tänne tuodaan myöhemmin toimiva versio mapscreenistä löytyvästä saman nimisestä funktiosta

function FetchStashes() {

  const [locations, setLocations] = useState([]);

  Firebase.database()
    .ref('/stashes/-MVGKSMRr2ArPReUCVFp')
    .once('value')
    .then(snapshot => {
      Alert.alert(">>" + snapshot.val().latlong.latitude);
    });

  return locations;
}