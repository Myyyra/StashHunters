import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { firebaseAuth } from '../config/Firebase';

export default function HomeScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('BottomNavi'))
      .catch(error => setErrorMsg(error));
  }

  const resetPassword = () => {
    firebaseAuth.sendPasswordResetEmail(email).then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/kartta.png')} style={styles.image}>

        <View style={styles.textHeader}>
          <Text style={{ fontSize: 42, fontWeight: 'bold', textAlign: 'center' }} >Let's play StashHunters!</Text>
          <Text style={{ fontSize: 18, color: 'red' }}>{errorMsg}</Text>
        </View>

        <View style={styles.textInputView}>
          <View style={styles.inputBackground}>
          <TextInput
            style={styles.textInput}
            placeholder='email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
          />
          <TextInput
            secureTextEntry
            style={styles.textInput}
            placeholder='password'
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>LOGIN</Text>
            </View>
          </TouchableOpacity>

            <Text style={{ fontSize: 20, marginTop: 10 }} onPress={() => navigation.navigate('ForgotPassword')}>Forgot your password?</Text>
          </View>
        </View>

        <View style={styles.textParagraph}>
          <Text style={{ fontSize: 20, marginBottom: 10 }} onPress={() => navigation.navigate('SignUp')}>Create a new account</Text>
          <Text style={{ fontSize: 20 }} onPress={() => navigation.navigate('BottomNavi')}>Continue without login</Text>
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
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  textParagraph: {
    textAlign: "center",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f5f4',
    borderTopWidth: 1
  },
  textInputView: {
    flex: 3,
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
  textInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    width: 200,
    height: 40,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  loginBtn: {
    backgroundColor: '#029B76',
    borderRadius: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',

  },
  loginBtnText: {
    color: 'white',
    padding: 10,
    fontSize: 20
  }
});