import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDistance } from 'geolib';
import StashHandling from './StashHandling.js';
import LocationActions from './LocationActions';
import { rules } from '../GameRules.js';
import { useIsFocused } from "@react-navigation/native";
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function StashListView({ navigation }) {
    const [currentPosition, setCurrentPosition] = useState({});
    const [stashes, setStashes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        showStashes();
    }, [isFocused]);

    const showStashes = async () => {
        let location = await LocationActions.findLocation();

        setCurrentPosition({ latitude: location.latitude, longitude: location.longitude });

        let all = await StashHandling.getAllStashes();

        const nearOnes = all.filter(d => calculateDistance(d, location) < rules.stashListRange);

        setStashes(nearOnes);
    }

    const calculateDistance = (stash, location) => {
        let distance = getDistance(location, {
            latitude: stash.latitude,
            longitude: stash.longitude
        });
        return distance;
    }

    //set the header font
    const [fontsLoaded] = useFonts({
        PressStart2P_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.headerFont}>Nearby Stashes</Text>
            </View>
            <View style={styles.list}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <View style={styles.listcontainer}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                            <Text style={{ fontSize: 18 }}>{item.description}</Text>
                            <View style={styles.distance}>
                                <Text>{calculateDistance(item, currentPosition)} meters away</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('StashCard', item)}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>STASH CARD</Text>
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
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 20
    }
});