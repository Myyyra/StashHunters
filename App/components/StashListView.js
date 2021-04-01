import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import Firebase from '../config/Firebase';

export default function StashListView({ navigation }) {

  const [permission, setPermission] = useState(Location.PermissionStatus.UNDETERMINED);
  const [stashes, setStashes] = useState([]);


  //check if app is allowed to use location when started
  useEffect(() => {
    getStashes();
  }, []);

  const getStashes = async () => {
    await Firebase.database()
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
          renderItem={({ item }) =>
            <View style={styles.listcontainer}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>{item.title}</Text>
                <Text style={{fontSize: 18}}>{item.description}</Text>
              <Button title='STASH' onPress={() => navigation.navigate('StashCard', item)} />
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