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
import Loading from './components/Loading';
import EditStash from './components/EditStash';
import CameraScreen from './components/CameraScreen';
import ProfileScreen from './components/ProfileScreen';
import HiddenStashes from './components/HiddenStashes';
import FoundStashes from './components/FoundStashes';
import ForgotPassword from './components/ForgotPassword';
import Info from './components/Info';
import { firebaseAuth } from './config/Firebase';

const Tab = createBottomTabNavigator();

function BottomNavi() {

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'HomeScreen') {
        iconName = 'md-home';
      } else if (route.name === 'MapScreen') {
        iconName = 'md-map';
      } else if (route.name === 'ProfileScreen') {
        iconName = 'person-outline';
      } else if (route.name === 'CreateNewStash') {
        iconName = 'add-circle-outline';
      } else if (route.name === 'StashListView') {
        iconName = 'list';
      } else if (route.name === 'Info') {
          iconName = 'information-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}
      tabBarOptions={{
        style: { backgroundColor: '#029B76' },
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        activeBackgroundColor: '#067359'
      }}>
      <Tab.Screen name='MapScreen' component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen name='ProfileScreen' component={ProfileScreen} options={{ title: 'Profile' }}
        listeners={{
          tabPress: e => {
            if (!firebaseAuth.currentUser) {
              e.preventDefault();
            }
          }
        }} />
      <Tab.Screen name='CreateNewStash' component={CreateNewStash} options={{ title: 'Add' }}
        listeners={{
          tabPress: e => {
            if (!firebaseAuth.currentUser) {
              e.preventDefault();
            }
          }
        }} />
      <Tab.Screen name='StashListView' component={StashListView} options={{ title: 'List' }} />
          <Tab.Screen name='Info' component={Info} options={{ title: 'Info' }} />
    </Tab.Navigator>
  );
}



const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Loading" component={Loading} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="BottomNavi" component={BottomNavi} />
        <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
        <Stack.Screen options={{ headerShown: false }} name="StashCard" component={StashCard} />
        <Stack.Screen options={{ headerShown: false }} name="EditStash" component={EditStash} />
        <Stack.Screen options={{ headerShown: false }} name="CameraScreen" component={CameraScreen} />
        <Stack.Screen options={{ headerShown: false }} name="HiddenStashes" component={HiddenStashes} />
        <Stack.Screen options={{ headerShown: false }} name="FoundStashes" component={FoundStashes} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgotPassword} />
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

