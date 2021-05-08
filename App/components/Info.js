import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function Info() {
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
                <Text style={styles.headerFont}>Quick Guide to StashHunters </Text>
            </View>
            <View style={styles.info}>
                <ScrollView>
                    <Text style={styles.text}>Great to have you here! On this page you will find a quick
                    guide we have drawn up for you to get started with the game.</Text>

                    <Text style={styles.subHeader}>Player account</Text>
                    <Text style={styles.text}>You can hunt for stashes without creating a player account.
                    However, without a player account it is not possible to create new stashes or keep
                    score of the stashes you have found. If you wish to create new stashes and keep score
                    of the stashes you have found, you need to create a player account and sign in.</Text>

                    <Text style={styles.subHeader}>Map view</Text>
                    <Text style={styles.text}>You can browse for stashes on the map and get details of a specific
                    stash by touching the middle of the stash area. The map should focus on your
                    location after a few seconds. If you are hunting for a specific stash,
                    you will see the stash name on top of the screen.</Text>

                    <Text style={styles.subHeader}>Hunting for stashes</Text>
                    <Text style={styles.text}>You can select a specific stash you wish to hunt, and it will be
                    highlighted on the map. Just click “HUNT” button on the stash card.</Text>

                    <Text style={styles.subHeader}>Stash list</Text>
                    <Text style={styles.text}>From the list you can see stashes that are within 1 kilometer (0.62 miles) of your location. </Text>

                    <Text style={styles.subHeader}>Add a new stash to the map</Text>
                    <Text style={styles.text}>You can add new stashes to the map if there are no other stashes within
                    a distance of 100 meters (328 feet) of your current location. Give your stash a cool name, write
                    a short description and take a picture of the stash as a clue for the hunters.</Text>

                    <Text style={styles.subHeader}>Edit or archive your stash</Text>
                    <Text style={styles.text}>You can edit the title and the description of the stashes you have created
                    by clicking “EDIT” on the stash card. If you wish to remove your stash from the map, just click “ARCHIVE”
                    on the stash card. </Text>

                    <Text style={styles.subHeader}>Your profile</Text>
                    <Text style={styles.text}>You can see your username, avatar, and the statistics of the stashes you have
                    hidden and found on your profile page. At the moment it’s not possible to change your avatar, but that
                    feature will be added soon.</Text>

                    <Text style={styles.endText}>We hope you enjoy playing StashHunters!</Text>
                </ScrollView>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    info: {
        flex: 5
    },
    subHeader: {
        fontSize: 24,
        margin: 15,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 20,
        margin: 15
    },
    endText: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 16,
        margin: 15
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 24,
        textAlign: 'center'
    }
});