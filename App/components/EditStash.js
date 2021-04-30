import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function EditStash({ navigation, route }) {

    const stash = route.params;

    //initialize states for editing the stash
    const [title, setTitle] = useState(stash.title);
    const [desc, setDesc] = useState(stash.description);


    //when save-button is pressed, save edits, inform the player that
    //saving was successful, and redirect back to stash card
    const saveAndRedirect = () => {
        saveStash();
        navigation.navigate('StashCard');
    }

    //save edits to database
    const saveStash = () => {
        try {
            Firebase.database().ref('stashes/' + stash.key).update(
                {
                    title: title,
                    description: desc
                }
            );

            Alert.alert("Editing successful!");

        } catch (error) {
            console.log("Error saving stash " + error);
        }
    };


    return (
        <View style={styles.container}>
            <Text>Edit your stash</Text>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
            />
            <TextInput
                multiline
                numberOfLines={4}
                style={styles.inputBig}
                onChangeText={setDesc}
                value={desc}
            />

            <Button
                onPress={saveAndRedirect}
                title="Save changes"
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
    inputBig: {
        width: 200,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    }
});