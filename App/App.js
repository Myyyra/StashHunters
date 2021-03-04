import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './components/MapScreen';
import HomeScreen from './components/HomeScreen';
import CreateNewStash from './components/CreateNewStash';

export default function App() {
  
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
  
      if (route.name === 'HomeScreen') {
        iconName = 'md-home';
      } else if (route.name === 'MapScreen') {
        iconName = 'md-map';
      } else if (route.name === 'CreateNewStash') {
        iconName = 'add-circle-outline';
      }
  
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions = { screenOptions }>
        <Tab.Screen name='CreateNewStash' component={ CreateNewStash } options={{ title: 'Add'}}/>
        <Tab.Screen name='MapScreen' component={ MapScreen } options={{ title: 'Map' }}/>
        <Tab.Screen name='HomeScreen' component={ HomeScreen } options={{ title: 'My home' }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

