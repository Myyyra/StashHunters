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
            <Text>Create new stash</Text>
            <TextInput  
                style = {styles.input}
                onChangeText = {title => setTitle(title)}
                value={title}
            />
            <TextInput  
                style = {styles.input}
                onChangeText = {desc => setDesc(desc)}
                value={desc}
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