import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Firebase from '../config/Firebase';
import Geolocation from '@react-native-community/geolocation';


export default function MapScreen() {

  const [latitude, setLatitude] = useState(60.201313);
  const [longitude, setLongitude] = useState(24.934041);
  const [stashes, setStashes] = useState([]);
  const [hunted, setHunted] = useState([]);

  //this is for haaga helia so might delete later
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121
  });

  const getStashes = async () => {
    try {
      await Firebase.database()
        .ref('/stashes')
        .on('value', snapshot => {
          const data = snapshot.val();
          const s = Object.values(data);
          setStashes(s);
        });
    } catch (error) {
      console.log("ALERT! Haussa virhe " + error)
    }

  }

  const findLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  }

  useEffect(() => {
    getStashes();
  }, []);

  //useEffect(() => {
  //  Alert.alert("hello");
  //}, [Geolocation.watchPosition()]);


  return (
    <View style={styles.map}>

      <MapView
        style={styles.map}
        region={region} >

        {stashes.map((stash, index) => (

          <Marker
            key={index}

            coordinate={{ latitude: parseFloat(stash.latitude), longitude: parseFloat(stash.longitude) }}

            title={stash.title}
            description={stash.description}

            image={require('../assets/flag.png')}

            onPress={() => setHunted(stash)}
          />
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


