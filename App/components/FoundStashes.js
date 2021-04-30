import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function HiddenStashes({ navigation, route }) {

    const stashes = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Your Found Stashes</Text>
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
        padding: 5,
        borderColor: '#029B76',
    },
    stashBtnPosition: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
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
    }
});