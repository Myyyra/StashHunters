import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Geolocation from "react-native-geolocation-service";

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
}else {
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
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(60.201313);
  const [longitude, setLongitude] = useState(24.934041);
  const [maprange, setMapRange] = useState(0.0001)


  //tee että tämä alla oleva async juttu tehdään vain nappia painaessa 
  //laita async osuus funktion sisään jota kutsutaan kun painaa uploadlocation
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  

  const saveStash = () => {

    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      Alert.alert("tässä olet " + latitude + " : " + longitude);

      firebase.database().ref('stashes/').push(
          {
            location
          }
      );

    })();
    }
  
    text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);

    
    
    
    //Alert.alert("heitetty firebaseen");
  }

  useEffect(() => {saveStash}, []);

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
          title='Haaga-Helia' />
      
      </MapView>
      

      <Text></Text>
      <Button title="UploadLocation" onPress={saveStash} />
      <StatusBar style="auto" />
    </View>

    
  );
}


