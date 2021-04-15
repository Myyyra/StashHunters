import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert } from 'react-native';
import Firebase from '../config/Firebase';

export default function StashCard({ navigation, route }) {

    const [edited, setEdits] = useState({});

    const stash = route.params;
    const key = stash.key;

    useEffect(() => {
        getStashes();
    }, []);

    const getStashes = async () => {
        await Firebase.database()
            .ref('/stashes/' + stash.key)
            .on('value', snapshot => {
                const data = snapshot.val();
                setEdits(data);
            });
    }

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
            </View>

            <View style={styles.image}>
                <Image source={require('../assets/no-image-icon.png')} />
            </View>

            <View style={styles.description}>
                <Text style={styles.descriptionText}>{edited.description}</Text>
                <Button title="Edit" color='#029B76' onPress={() => navigation.navigate('EditStash', stash)} />
                <Button title="Archive" color='#FF1B1B' onPress={() => archiveStash()} />
                <Button title="BACK" color='#908F8F' onPress={() => navigation.goBack()} />
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
        alignItems: 'center',
        justifyContent: 'center',

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
        marginBottom: 15
    }

});
