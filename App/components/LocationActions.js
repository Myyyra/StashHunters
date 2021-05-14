import * as Location from 'expo-location';

class LocationActions {

    findLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({})
            return { latitude: location.coords.latitude, longitude: location.coords.longitude };
        }
        else {
            Alert.alert("No permission to device location");
            return null;
        }
    }

}
const locationActions = new LocationActions();
export default locationActions;
