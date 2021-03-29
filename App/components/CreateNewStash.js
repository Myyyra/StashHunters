import React, { useState} from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
//import * as firebase from 'firebase';
import Firebase from '../config/Firebase';

const firebase = Firebase;

export default function CreateNewStash({navigation}) {
    
    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState(60.201313);
    const [longitude, setLongitude] = useState(24.934041);

    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = () => {
        saveStash();
        Alert.alert("Stash saved");
        setTitle('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        navigation.navigate('MapScreen');
    }

    //save the created stash to database
    const saveStash = () => {
        (async () => {            
    
            firebase.database().ref('stashes/').push(
                {
                latitude: latitude,
                longitude: longitude,
                title: title,
                description: desc
                }
            );         
        })();
        }
    
    return(
        <View style = {styles.container}>
            <Text>Create new stash</Text>
            <TextInput  
                style = {styles.input}
                onChangeText = {title => setTitle(title)}
                value={title}
                placeholder='Stash name'
            />
            <TextInput  
                style = {styles.input}
                onChangeText = {desc => setDesc(desc)}
                value={desc}
                placeholder='Description'
            />

            <TextInput  
                style = {styles.input}
                onChangeText = {latitude => setLatitude(latitude)}
                value={latitude}
                placeholder='Latitude'
            />

            <TextInput  
                style = {styles.input}
                onChangeText = {longitude => setLongitude(longitude)}
                value={longitude}
                placeholder='Longitude'
            />
            <Button 
                onPress = {saveAndRedirect}
                title = "Save" 
                color='#029B76'
            />
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
    input: {
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10
    },
    button: {

    }
   });