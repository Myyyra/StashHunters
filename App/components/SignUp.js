import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

export default function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        // TODO: Firebase
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/kartta.png')} style={{ width: '100%', height: '100%' }}>

                <View style={styles.heading}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Create a new account</Text>
                </View>

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={handleSignUp}>
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
        marginBottom: 20,
        paddingLeft: 5,
        borderRadius: 3,
        backgroundColor: 'white'
    },
    inputView: {
        flex: 2,
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
    }
});
