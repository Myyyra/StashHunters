import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CreateNewStash from './components/CreateNewStash';

//TODO: encrypt
const firebaseConfig = {
  apiKey: "AIzaSyASqO9wJOkRQjhDAFeP2_JFYkK9wriEnUo",
  authDomain: "stashhunters.firebaseapp.com",
  databaseURL: "https://stashhunters-default-rtdb.firebaseio.com/",
  projectId: "stashhunters",
  storageBucket: "stashhunters.appspot.com",
  messagingSenderId: "220185997672",
  appId: '1:220185997672:android:690340e1588b24eea9e6dd'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
} 

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

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

export default function App() {
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState(60.201313);
  const [longitude, setLongitude] = useState(24.934041);
  const [maprange, setMapRange] = useState(0.0001);
  const [permission, setPermission] = useState(Location.PermissionStatus.UNDETERMINED);

  //check if app is allowed to use location when started
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status === 'granted') {
        setPermission('granted');
        getCurrentLocation();
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
      
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  
    //Alert.alert("tässä olet " + latitude + " : " + longitude);
  }
  
  const saveStash = () => {
    (async () => {
      if (permission === 'granted') {        
        getCurrentLocation();

        let userMsg = "tötttörröö";
        let desc = "koti"

        firebase.database().ref('stashes/').push(
            {
              location,
              title: userMsg,
              description: desc
            }
        );
        //if no permission to location, give error msg
      } else { 
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission to access location was denied');
      }
    })();
  }


  return (
    <View style={styles.container}>
    
      <MapView
        style={styles.map}
        region={{
          latitude: latitude + maprange,
          longitude: longitude + maprange,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
      }} >

      <Marker
        coordinate={{
          latitude: latitude, 
          longitude: longitude}}
          title='Haaga-Helia' 
      />
      
      </MapView>
      <Button title="New stash" onPress={saveStash} />
      <StatusBar style="auto" />
    </View>
  );
}


