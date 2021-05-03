import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import Firebase from '../config/Firebase';

export default function StashCard({ navigation, route }) {

    const [edited, setEdits] = useState({});
    const [stashImage, setStashImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const stash = route.params;
    const key = stash.key; //stash key and photo's unique name in storage
    let imageRef = Firebase.storage().ref('images/' + key);

    useEffect(() => {
        getStashes();
        getStashImage();
    }, []);


    const getStashes = async () => {

        try {
            await Firebase.database()
                .ref('/stashes/' + stash.key)
                .on('value', snapshot => {
                    const data = snapshot.val();
                    setEdits(data);
                });
        } catch (error) {
            console.log("Error fetching stash " + error);

        }
    };

    const archiveStash = () => {
        try {
            Firebase.database().ref('stashes/' + key).update(
                {
                    disabled: true
                }
            );
            Alert.alert('Please note!', 'Your stash will be removed from the map!');
        } catch (error) {
            console.log("Error archiving stash " + error);
        }
        setEdits({ ...edited, disabled: true });
    };

    const activateStash = () => {
        try {
            Firebase.database().ref('stashes/' + key).update(
                {
                    disabled: false
                }
            );
        } catch (error) {
            console.log("Error archiving stash " + error);
        }
        setEdits({ ...edited, disabled: false });
    };

    const getStashImage = () => {
        imageRef.getDownloadURL()
            .then((url) => {
                setStashImage(url);
                setImageLoaded(true);
            })
            .catch((e) => console.log('Error retrieving stash image ' + e));
    }
    function ArchiveButton() {
        return (<TouchableOpacity onPress={() => archiveStash()}>
            <View style={styles.archiveBtn}>
                <Text style={styles.btnText}>ARCHIVE</Text>
            </View>
        </TouchableOpacity>);
    }

    function ActivateButton() {
        return (<TouchableOpacity onPress={() => activateStash()}>
            <View style={styles.activateBtn}>
                <Text style={styles.btnText}>ACTIVATE</Text>
            </View>
        </TouchableOpacity>);
    }

    function ActivateOrArchive() {
        if (edited.disabled) {
            return <ActivateButton />
        } else {
            return <ArchiveButton />
        }
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{edited.title}</Text>
            </View>

            <View style={styles.container}>
                {imageLoaded === false ?
                    <Image source={require('../assets/no-image-icon.png')} />
                    :
                    <Image source={{ uri: stashImage }} style={styles.image} />
                }
            </View>

            <View style={styles.description}>
                <Text style={styles.descriptionText}>{edited.description}</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditStash', stash)}>
                        <View style={styles.editBtn}>
                            <Text style={styles.btnText}>EDIT</Text>
                        </View>
                    </TouchableOpacity>
                    <ActivateOrArchive />
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => navigation.navigate('MapScreen', stash)}>
                        <View style={styles.huntBtn}>
                            <Text style={styles.btnText}>HUNT</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <View style={styles.backBtn}>
                            <Text style={styles.btnText}>GO BACK</Text>
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
    back: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        margin: 20
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        flex: 2
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 3 / 2,
        resizeMode: 'contain'
    },
    description: {
        flex: 2,
        justifyContent: 'space-evenly'
    },
    descriptionText: {
        fontSize: 20,
        margin: 15
    },
    hunt: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    backBtn: {
        backgroundColor: '#029B76',
        width: 130,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editBtn: {
        backgroundColor: '#eb8221',
        width: 130,
        borderRadius: 5,
        marginRight: 15,
        alignItems: 'center'
    },
    huntBtn: {
        backgroundColor: 'green',
        width: 130,
        borderRadius: 5,
        marginRight: 15,
        alignItems: 'center'
    },
    archiveBtn: {
        backgroundColor: '#a60225',
        width: 130,
        borderRadius: 5,
        alignItems: 'center'
    },
    activateBtn: {
        backgroundColor: '#029B76',
        width: 130,
        borderRadius: 5,
        marginBottom: 15,
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
    }

});
