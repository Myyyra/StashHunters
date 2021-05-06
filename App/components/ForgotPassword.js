import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { firebaseAuth } from '../config/Firebase';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function HomeScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const resetPassword = () => {
        firebaseAuth.sendPasswordResetEmail(email).then(function () {
            Alert.alert('Email sent!', 'Check your email and follow the link to reset your password')
        }).catch(function (error) {
            Alert.alert('Error')
        });
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
            <ImageBackground source={require('../assets/kartta.png')} style={styles.image}>

                <View style={styles.textHeader}>
                    <Text style={styles.headerFont} >Reset your password</Text>
                </View>

                <View style={styles.textInputView}>
                    <View style={styles.inputBackground}>
                        <Text style={styles.text}>Please give the email address linked to your account.
                            Follow the link we will send to the address to reset your password.</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='email'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                        />
                        <TouchableOpacity onPress={resetPassword}>
                            <View style={styles.sendBtn}>
                                <Text style={styles.sendBtnText}>SEND</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.text} onPress={() => navigation.goBack()}>Cancel</Text>
                    </View>
                </View>
            </ImageBackground>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    image: {
        flex: 1,
        resizeMode: 'cover'
    },
    textHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textInputView: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBackground: {
        backgroundColor: '#f2f5f4',
        padding: 40,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7
    },
    text: {
        fontSize: 20,
        margin: 15
    },
    textInput: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        width: 250,
        height: 40,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        fontSize: 18,
    },
    sendBtn: {
        backgroundColor: '#029B76',
        borderRadius: 5,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',

    },
    sendBtnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 24,
        textAlign: 'center'
    }
});