import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { firebaseAuth } from '../config/Firebase';

export default function Loading({ navigation }) {
    useEffect(() => {
        firebaseAuth.onAuthStateChanged(user => {
            navigation.navigate(user ? 'BottomNavi' : 'Home')
        })
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/kartta.png')} style={{ width: '100%', height: '100%' }}>

                <View style={styles.header}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Loading...</Text>
                </View>

            </ImageBackground>
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
        justifyContent: 'center'
    }
});
