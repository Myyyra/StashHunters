import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSignUp = () => {
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(newUser => {
                Firebase.database().ref('users').child(newUser.user.uid).set({
                    username: username
                })
            })
            .then(() => {
                Alert.alert('User account created and signed in!', `Get started by checking out the "Info" page`);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-exists') {
                    Alert.alert('Email already exists', 'Use a different email');
                }
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Email is invalid');
                }
                if (error.code === 'auth/invalid-password') {
                    Alert.alert('Password must be at least six characters long');
                }
                console.log(error);
            });
    }
    const checkPassword = () => {
        let check = password.localeCompare(password2);
        console.log(check);
        if (check === 0) {
            handleSignUp();
        } else {
            Alert.alert('Passwords do not match', 'Please check your passwords');
        }
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
            <ImageBackground source={require('../assets/kartta.png')} style={{ width: '100%', height: '100%' }}>

                <View style={styles.heading}>
                    <Text style={styles.headerFont}>Create a new account</Text>
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Repeat password"
                        value={password2}
                        onChangeText={setPassword2}
                    />
                    <TouchableOpacity onPress={checkPassword}>
                        <View style={styles.signUpBtn}>
                            <Text style={styles.signUpBtnText}>SIGN UP</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.signIn}>
                    <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }} onPress={() => navigation.navigate('Home')}>Already have an account? Sign in!</Text>
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
    heading: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        fontSize: 20,
        borderWidth: 1,
        width: 250,
        height: 40,
        marginBottom: 15,
        paddingLeft: 5,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    inputView: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    signIn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signUpBtn: {
        backgroundColor: '#029B76',
        borderRadius: 5
    },
    signUpBtnText: {
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
