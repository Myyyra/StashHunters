import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';
import CreateNewStash from './components/CreateNewStash';
import StashListView from './components/StashListView';
import SignUp from './components/SignUp';
import StashCard from './components/StashCard';

const Tab = createBottomTabNavigator();

function BottomNavi() {
  
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
      else if (route.name === 'StashListView') {
        iconName = 'list';
      }
  
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });

  return (
    <Tab.Navigator screenOptions = { screenOptions }>
      <Tab.Screen name='MapScreen' component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen name='CreateNewStash' component={ CreateNewStash } options={{ title: 'Add'}}/>
      <Tab.Screen name='StashListView' component={ StashListView } options={{ title: 'List'}}/>
    </Tab.Navigator>
  );
  }



const Stack = createStackNavigator();

export default function App() {  

  return (
    <NavigationContainer>      
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="BottomNavi" component={BottomNavi} />
        <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
        <Stack.Screen options={{ headerShown: false }} name="StashCard" component={StashCard} />
      </Stack.Navigator>
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

