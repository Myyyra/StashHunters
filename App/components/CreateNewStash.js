import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';




const CreateNewStash = () => {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const saveStash = () => {
        Alert.alert("Stash saved");
    }

    return(
        <View style = {styles.container}>
            <TextInput  
                style = {styles.input}
                onChangeText = {t => setTitle(t)}
                value={t}
            />
            <TextInput  
                style = {styles.input}
                onChangeText = {d => setDesc(d)}
                value={d}
            />
            <Button 
                onPress = {saveStash}
                title = "Save"
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
        borderWidth: 1
    },
    button: {

    }
   });

export default CreateNewStash;