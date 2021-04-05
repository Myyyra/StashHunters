import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function MapScreen({ navigation }) {
  const [stashes, setStashes] = useState([]);
  const { currentUser } = firebaseAuth;

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

  useEffect(() => {
    getStashes();
  }, []);


  const handleLogout = () => {
    firebaseAuth.signOut()
      .then(() => navigation.navigate('Home'))
      .catch(error => console.log(error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{currentUser.displayName}</Text>
          <Text style={styles.headerText} onPress={handleLogout}>LOGOUT</Text>
        </View>
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
            />
          ))}

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
  map: {
    ...StyleSheet.absoluteFillObject,
    top: 30
  },
});