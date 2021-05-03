import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import Firebase, { firebaseAuth } from '../config/Firebase';

export default function HiddenStashes({ navigation }) {
    const [stashes, setStashes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        getHiddenStashes();
    }, [isFocused]);

    const getHiddenStashes = async () => {
        try {
            await Firebase.database()
                .ref('/stashes')
                .once('value', snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const s = Object.values(data);
                        const hidden = s.filter(d => d.owner === firebaseAuth.currentUser.uid);

                        setStashes(hidden);
                    }
                });
        } catch (error) {
            console.log("ALERT! Error finding hidden stashes " + error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Your Hidden Stashes</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <View style={styles.backBtn}>
                        <Ionicons name='arrow-back-outline' size={30} color='white' />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.list}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                    <View style={styles.listcontainer}>
                        <View>
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text style={{ fontSize: 18 }}>{item.description}</Text>
                            </View>
                        <View style={styles.stashBtnPosition}>                                
                            <TouchableOpacity onPress={() => navigation.navigate('StashCard', item)}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>STASH</Text>
                                </View>
                            </TouchableOpacity>
                                {item.disabled === true && <Text style={styles.disabledText}>ARCHIVED</Text>}
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
        flexDirection: 'row',
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
        padding: 10,
        borderColor: '#029B76',
    },
    stashBtnPosition: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5
    },
    btn: {
        backgroundColor: '#029B76',
        borderRadius: 5
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
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
    disabledText: {
        color: 'red',
        fontSize: 22,
        fontWeight: 'bold'
    }



});