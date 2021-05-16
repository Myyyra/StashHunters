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

    randomCenter = (location) => {
        let latitude = location.latitude;
        let longitude = location.longitude;
        let diff = rules.circleRad * 0.0000081; // constant number was calculated to adjust lat and long numbers to meters

        let x = latitude + (Math.random() * diff);
        let y = longitude + (Math.random() * diff);

        return { latitude: parseFloat(x), longitude: parseFloat(y) }; // modifies randomized numbers to adhere to convention of showing lat and long with 7 decimal points
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
