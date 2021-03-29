import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button, FlatList } from 'react-native';
//import * as firebase from 'firebase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Firebase from '../config/Firebase';

const firebase = Firebase;

export default function MapScreen() {
  
  const [permission, setPermission] = useState(Location.PermissionStatus.UNDETERMINED);
  const [stashes, setStashes] = useState([]);


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
  
  

  return (
    <View style={styles.container}>
        <View style={styles.title}>
            <Text style={{fontSize: 28, fontWeight: 'bold'}}>Nearby Stashes</Text>
        </View>
        <View style={styles.list}>
            <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({item}) => <View style={styles.listcontainer}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>{item.title}</Text>
                <Text style={{fontSize: 18}}>{item.description}</Text>
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
        padding: 5
    }



   });