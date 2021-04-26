import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, Text, View, Alert, Button, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Firebase, { firebaseAuth } from '../config/Firebase';
import CameraScreen from './CameraScreen';
import * as ImagePicker from 'expo-image-picker';

let lat = 60.201313;
let long = 24.934041;
let circleRad = 50;

export default function CreateNewStash({ navigation }) {

    //initialize states for creating a new stash
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [stashes, setStashes] = useState([]);
    const camera = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [done, setDone] = useState(false);
    const [photoCacheUri, setPhotoCacheUri] = useState('');

    useEffect(() => {
        getStashes();
        findLocation();
    }, []);


    //when save-button is pressed, save the new stash, inform the player that
    //saving was successful, and redirect to map view
    const saveAndRedirect = () => {
        saveStash();
        setTitle('');
        setDesc('');
        setPhoto(null);
        setDone(false);
        lat = '';
        long = '';
        navigation.navigate('MapScreen');
    }

    const findLocation = async () => {

        let { status } = await Location.requestPermissionsAsync();

        if (status === 'granted') {
            await Location.getCurrentPositionAsync({})
                .then(location => {
                    lat = location.coords.latitude;
                    long = location.coords.longitude;
                });
        }
    }

    //save the created stash to database
    //checks if the are no other stahes too near
    const saveStash = () => {

        getStashes();
        findLocation().then(() => {

            let tooClose = false;
            stashes.forEach(stash => {

                //distance between stash and user location in meters
                let distance = getDistance(
                    {
                        //user location
                        latitude: lat,
                        longitude: long,
                    },
                    {
                        //compared stash location
                        latitude: stash.latitude,
                        longitude: stash.longitude,
                    }
                )

                //muokkaa tänne parempi etäissyy arvo kun tarttee
                //lähin testattu piilo oli 35 metrin päässä 
                if (distance < 34) {
                    Alert.alert("There is another Stash too close");
                    tooClose = true;
                }

            })

            //if there is no close stashes save location to firebase
            if (tooClose === false) {
                try {
                    let key = getKey();
                    console.log(key);

                    let photokey = key+'_photo';

                    let photoURL = Firebase.storage().ref().child('images/' + photokey);

                    uploadImage(photoCacheUri, photokey)
                    .then(console.log('Success uploading the image.'))
                    .then(() => {
                        Alert.alert('Success');
                    })             
                    .catch((error) => {
                        Alert.alert(error);
                    });

                    Firebase.database().ref('stashes/' + key).set(
                        {
                            latitude: lat,
                            longitude: long,
                            title: title,
                            description: desc,
                            owner: firebaseAuth.currentUser.uid,
                            disabled: false,
                            key: key,
                            circleLat: randomCenter().latitude,
                            circleLng: randomCenter().longitude,
                            photoURL: photoURL
                        }
                    )
                } catch (error) {
                    console.log("Error saving stash " + error);
                }
            }
        });
    }

    const getKey = () => {
        return Firebase.database().ref('stashes/').push().getKey();
    }

    const getStashes = () => {
        try {
            Firebase.database()
                .ref('/stashes')
                .on('value', snapshot => {
                    const data = snapshot.val();
                    const s = Object.values(data);
                    setStashes(s);
                });
        } catch (error) {
            console.log("Error at getting stashes from firebase " + error);
        }
    }

    const randomCenter = (stash) => {

        let latitude = stash.latitude;
        let longitude = stash.longitude;
        let diff = circleRad * 0.0000081;

        let x = latitude + (Math.random() * (diff - (-diff) - diff));
        let y = longitude + (Math.random() * (diff - (-diff) - diff));

        return { latitude: x, longitude: y };
    }

    const snap = async () => {
        if (camera) {
            let result = await ImagePicker.launchCameraAsync();
            //let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.cancelled) {
            setPhoto(result);
            setDone(true);
            setPhotoCacheUri(result.uri);
            }
        }
    }

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
    
        let ref = Firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob);
      }


    return (

        <View style={styles.container}>
            <Text style={styles.header}>Create new stash</Text>
            
            <View style={styles.image}>
                <TouchableOpacity onPress={snap}>
                    {done ?
                    <View style={styles.image}>
                    <Image source={photo} style={{height: 200, width: 200}}/>
                    </View>
                    :
                    <Image source={require('../assets/no-image-icon.png')} />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.description}>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder='Stash name'
            />
            <TextInput
                multiline
                numberOfLines={4}
                style={styles.input}
                onChangeText={setDesc}
                value={desc}
                placeholder='Description'
            />

            <Button
                onPress={saveAndRedirect}
                title="Save"
                color='#029B76'
            />
            </View>
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
    input: {
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10
    },
    inputBig: {
        width: 200,
        height: 75,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    },
    image: {
        flex: 2,
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '10%'
    },
    description: {
        flex: 2,
        justifyContent: 'space-evenly'
    },
});