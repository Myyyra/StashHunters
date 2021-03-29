import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
//import * as firebase from 'firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CreateNewStash from './CreateNewStash';
import Firebase from '../config/Firebase';

const firebase = Firebase;

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

export default function MapScreen() {
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude, setLatitude] = useState(60.201313);
  const [longitude, setLongitude] = useState(24.934041);
  const [maprange, setMapRange] = useState(0.0001);
  const [permission, setPermission] = useState(Location.PermissionStatus.UNDETERMINED);
  const [stashes, setStashes] = useState([]);

  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121
  });

  //check if app is allowed to use location when started
  useEffect(() => {

    getStashes();

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
  }

  const getStashes = () => {
    firebase.database()
        .ref('/stashes')
        .on('value', snapshot => {
          const data = snapshot.val();
          const s = Object.values(data);
          setStashes(s);
        });
  }
  
  const saveStash = () => {
    (async () => {
      if (permission === 'granted') {        
        getCurrentLocation();

        let userMsg = "täällä ollaan";
        let desc = "puisto"
        let LatLong = {
          latitude: latitude,
          longitude: longitude
        }

        firebase.database().ref('stashes/').push(
            {
              latlong: LatLong,
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
    <View style={styles.map}>
    
      <MapView
        style={styles.map}
        region={region} >
 
      

      {stashes.map((stash, index) => (
        
          <Marker
            key={index}

            coordinate={{ latitude : parseFloat(stash.latitude) , longitude : parseFloat(stash.longitude) }}

            title={stash.title}
            description={stash.description}

            image={require('../assets/flag.png')}
          />
        ))}
      
      </MapView>
      
      <StatusBar style="auto" />
    </View>
  );
}