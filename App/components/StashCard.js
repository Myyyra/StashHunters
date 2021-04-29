import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { Ionicons } from '@expo/vector-icons';

export default function StashCard({ navigation, route }) {

    const [edited, setEdits] = useState({});

    const stash = route.params;
    const key = stash.key;

    useEffect(() => {
        getStashes();
    }, []);

    const getStashes = async () => {

        try {
            await Firebase.database()
            .ref('/stashes/' + stash.key)
            .on('value', snapshot => {
                const data = snapshot.val();
                setEdits(data);
            });
        } catch (error) {
            console.log("Error fetching stash " + error);

        }
    };

    const archiveStash = () => {
        try {
            Firebase.database().ref('stashes/' + key).update(
                {
                    disabled: true
                }
            );
            Alert.alert('Please note!', 'Your stash will be removed from the map!');
            navigation.goBack();
        } catch (error) {
            console.log("Error archiving stash " + error);
        }
    };


    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{edited.title}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <View style={styles.backBtn}>
                        <Ionicons name='arrow-back-outline' size={30} color='white' />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.image}>
                <Image source={require('../assets/no-image-icon.png')} />
            </View>

            <View style={styles.description}>
                <Text style={styles.descriptionText}>{edited.description}</Text>
                {firebaseAuth.currentUser.uid == stash.owner &&

                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={() => navigation.navigate('EditStash', stash)}>
                            <View style={styles.editBtn}>
                                <Text style={styles.btnText}>EDIT</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => archiveStash()}>
                            <View style={styles.archiveBtn}>
                                <Text style={styles.btnText}>ARCHIVE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                }

            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    image: {
        flex: 2
    },
    description: {
        flex: 2,
        justifyContent: 'space-evenly'

    },
    descriptionText: {
        fontSize: 20,
        margin: 15
    },
    backBtn: {
        backgroundColor: '#029B76',
        width: 50,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 30,
        justifyContent: 'center'
    },
    editBtn: {
        backgroundColor: '#029B76',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
        marginRight: 15,
        alignItems: 'center'
    },
    archiveBtn: {
        backgroundColor: '#a60225',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    }

});
