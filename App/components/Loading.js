import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { firebaseAuth } from '../config/Firebase';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function Loading({ navigation }) {
    useEffect(() => {
        firebaseAuth.onAuthStateChanged(user => {
            navigation.navigate(user ? 'BottomNavi' : 'Home')
        })
    }, []);

    //set the header font
    const [fontsLoaded] = useFonts({
        PressStart2P_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/kartta.png')} style={{ width: '100%', height: '100%' }}>

                <View style={styles.header}>
                    <Text style={styles.headerFont}>Loading...</Text>
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
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 30
    }
});
