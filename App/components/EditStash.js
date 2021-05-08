import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import Firebase from '../config/Firebase';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

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
            console.log("Error saving edited stash " + error);
        }
    };

    //set the header font
    const [fontsLoaded] = useFonts({
        PressStart2P_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerFont}>Edit your stash</Text>
            </View>

            <View style={styles.inputView}>
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
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={saveAndRedirect}>
                        <View style={styles.saveBtn}>
                            <Text style={styles.btnText}>SAVE CHANGES</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.backBtn}>
                            <Text style={styles.btnText}>CANCEL</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    inputView: {
        flex: 3,
        alignItems: 'center',
    },
    input: {
        width: 275,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10,
        borderRadius: 5,
        fontSize: 20
    },
    inputBig: {
        width: 275,
        height: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10,
        borderRadius: 5,
        fontSize: 20
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 20
    },
    saveBtn: {
        backgroundColor: '#029B76',
        width: 170,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 15
    },
    backBtn: {
        backgroundColor: '#a60225',
        width: 100,
        borderRadius: 5,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15
    },
});