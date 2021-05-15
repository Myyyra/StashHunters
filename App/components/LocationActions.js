import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { getDistance } from 'geolib';
import { rules } from '../GameRules.js';

class LocationActions {

    findLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({})
                return { latitude: location.coords.latitude, longitude: location.coords.longitude };
            }
            else {
                Alert.alert("No permission to device location");
                return null;
            }
        } catch (error) {
            console.log("Error finding location " + error);
        }
    }

    checkIfTooClose = (stashes, location) => {

        let tooClose = false;

        stashes.forEach(stash => {
            //distance between stash and user location in meters
            let distance = getDistance(
                {
                    //user location
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                {
                    //compared stash location
                    latitude: stash.latitude,
                    longitude: stash.longitude,
                }
            );
            // Compares to GameRules
            if (distance < rules.stashMinDist) {
                tooClose = true;
            }
        });

        return tooClose;

    }

}
const locationActions = new LocationActions();
export default locationActions;
