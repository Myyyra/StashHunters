import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import Firebase from '../config/Firebase';
import { getDistance } from 'geolib';

export default function StashListView({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState({});
  const [stashes, setStashes] = useState([]);

  useEffect(() => {
    getStashes();
    findLocation();
  }, []);

  const getStashes = async () => {
    await Firebase.database()
      .ref('/stashes')
      .on('value', snapshot => {
        const data = snapshot.val();
        const s = Object.values(data);
        const notDisabled = s.filter(d => d.disabled === false);
        const nearOnes = notDisabled.filter(d => calculateDistance(d) < 1000);

        setStashes(nearOnes);
      });
  }

  const findLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status === 'granted') {
      await Location.getCurrentPositionAsync({})
        .then(location => {
          setCurrentPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          console.log(location.coords.latitude);
        });
    } else {
      Alert.alert("Permission needed", "You need to allow the app to use your location");
    }
  }

  const calculateDistance = (stash) => {
    let distance = getDistance(currentPosition, {
      latitude: stash.latitude,
      longitude: stash.longitude
    });

    return distance;
  }


  return (
    <View style={styles.container}>
        <View style={styles.title}>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>Nearby Stashes</Text>
        </View>
        <View style={styles.list}>
            <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item }) =>
              <View style={styles.listcontainer}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>{item.title}</Text>
                <Text style={{fontSize: 18}}>{item.description}</Text>
                <View style={styles.distance}>
                  <Text>{calculateDistance(item)} meters away</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('StashCard', item)}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>STASH</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>} 
            data={stashes} 
            /> 
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listcontainer: {
    width: 350,
    borderWidth: 2,
    marginBottom: 10,
    padding: 5,
    borderColor: '#029B76'
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btn: {
    backgroundColor: '#029B76',
    borderRadius: 5
  },
  btnText: {
    color: 'white',
    padding: 10,
    fontSize: 20
}



});