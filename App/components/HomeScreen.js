import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { firebaseAuth } from '../config/Firebase';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

export default function HomeScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('BottomNavi'))
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Email address not found', 'Please check your email address');
            }
            if (error.code === 'auth/wrong-password') {
                Alert.alert('Wrong password', 'Please check your password');
            }
            console.log(error);
            console.log(error.code);
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
          <Text style={styles.headerFont} >Let's play StashHunters!</Text>
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

            <Text style={styles.text} onPress={() => navigation.navigate('ForgotPassword')}>Forgot your password?</Text>

          </View>
        </View>

        <View style={styles.textParagraph}>
          <Text style={styles.text} onPress={() => navigation.navigate('SignUp')}>Create a new account</Text>
          <Text style={styles.text} onPress={() => navigation.navigate('BottomNavi')}>Continue without login</Text>
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
  },
  text: {
    fontSize: 20,
    marginTop: 15
  },
  headerFont: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 27,
    textAlign: 'center'
}

});