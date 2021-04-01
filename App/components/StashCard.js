import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

export default function StashCard({ navigation, route }) {

    const stash = route.params;
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{stash.title}</Text>
            </View>

            <View style={styles.image}>
                <Image source={require('../assets/no-image-icon.png')} />
            </View>

            <View style={styles.description}>
                <Text style={styles.descriptionText}>{stash.description}</Text>
                <Button title="BACK" onPress={() => navigation.goBack()} />
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
        flex: 2
    },
    descriptionText: {
        fontSize: 20,
        marginBottom: 15
    }

});
