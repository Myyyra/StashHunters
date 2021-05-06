import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Firebase, { firebaseAuth } from '../config/Firebase';
import { useIsFocused } from "@react-navigation/native";
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';


export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});
    const [hiddenStashes, setHiddenStashes] = useState([]);
    const [hiddenLength, setHiddenLength] = useState(0);
    const [foundStashes, setFoundStashes] = useState([]);
    const [foundLength, setFoundLength] = useState(0);


    const isFocused = useIsFocused();

    useEffect(() => {
        getUser();
        getHiddenStashes();
        getFoundStashes();
    }, [isFocused]);


    const getHiddenStashes = async () => {
        try {
            await Firebase.database()
                .ref('/stashes')
                .once('value', snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const s = Object.values(data);
                        const hidden = s.filter(d => d.owner === firebaseAuth.currentUser.uid);

                        setHiddenStashes(hidden);
                        setHiddenLength(hidden.length);
                    }

                });
        } catch (error) {
            console.log("ALERT! Error finding hidden stashes " + error);
        }
    }

    const getFoundStashes = async () => {
        try {
            await Firebase.database()
                .ref('/users/' + firebaseAuth.currentUser.uid + '/foundStashes')
                .once('value', snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const found = Object.values(data);
                        setFoundStashes(found);
                        setFoundLength(found.length);
                    }
                });
        } catch (error) {
            console.log("ALERT! Error finding found stashes " + error);
        }
    }

    const getUser = async () => {
        try {
            await Firebase.database()
                .ref('/users/' + firebaseAuth.currentUser.uid)
                .on('value', snapshot => {
                    const data = snapshot.val();
                    setUser(data);
                });
        } catch (error) {
            console.log("ALERT! Error finding user " + error)
        }
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

            <View style={styles.header}>
                <Text style={styles.headerFont}>Hello {user.username}!</Text>
            </View>

            <View style={styles.image}>
                <Image source={require('../assets/avatar.png')} style={styles.imageSize} />
            </View>

            <View style={styles.description}>
                <Text style={styles.descriptionText}>Your stashes:</Text>

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => navigation.navigate('HiddenStashes', hiddenStashes)}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>Hidden ({hiddenLength})</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FoundStashes', foundStashes)}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>Found ({foundLength})</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

            <StatusBar style="auto" />
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
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    image: {
        flex: 2
    },
    imageSize: {
        height: 250,
        width: 250
    },
    description: {
        flex: 2,
        justifyContent: 'space-evenly'
    },
    descriptionText: {
        fontSize: 20,
        margin: 15
    },
    btn: {
        backgroundColor: '#029B76',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
        marginRight: 15,
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        padding: 10,
        fontSize: 20
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    headerFont: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 20
    }
});