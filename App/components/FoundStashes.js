import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';


export default function HiddenStashes({ navigation, route }) {

    const stashes = route.params;

    /*useEffect(() => {
        getStashes();
    }, []);


    const getStashes = async () => {
        await Firebase.database()
            .ref('/stashes')
            .once('value', snapshot => {
                const data = snapshot.val();
                const s = Object.values(data);
                const hidden = s.filter(d => d.owner === firebaseAuth.currentUser.uid);


                setStashes(hidden);
            });
    }*/

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Your Hidden Stashes</Text>
            </View>
            <View style={styles.list}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <View style={styles.listcontainer}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text style={{ fontSize: 18 }}>{item.description}</Text>
                            <View style={styles.distance}>
                                <TouchableOpacity onPress={() => navigation.navigate('StashCard', item)}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>STASH</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
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
        padding: 5,
        borderColor: '#029B76'
    },
    distance: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btn: {
        backgroundColor: '#029B76',
        borderRadius: 5
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    }



});