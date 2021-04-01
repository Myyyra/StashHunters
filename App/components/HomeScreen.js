import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';



export default function HomeScreen({navigation}) {
  
    
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/kartta.png')} style={styles.image, {width: '100%', height: '100%'}}>
        
        <View style={styles.textHeader}>
          <Text style={{fontSize: 42, fontWeight: 'bold', textAlign: 'center'}} >Let's play StashHunters!</Text>
        </View>
        
        <View style={styles.textInputView}>
          <TextInput style={styles.textInput} placeholder='username'></TextInput>
          <TextInput style={styles.textInput} placeholder='password'></TextInput>
          <Button color='#029B76' title='LOGIN'></Button>
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
    opacity: 0.3
  },
  textHeader: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textParagraph: {
    color: "black",
    textAlign: "center",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  textInputView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    width: 200,
    height: 40,
    marginBottom: 20,
    padding: 10
  }
});