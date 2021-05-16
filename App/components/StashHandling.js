import Firebase, { firebaseAuth } from '../config/Firebase';
import { Alert } from 'react-native';

class FetchStashes {

    getAllStashes = async () => {

        let stashes = [];

        try {
            await Firebase.database()
                .ref('/stashes')
                .once('value', snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const s = Object.values(data);
                        const notDisabled = s.filter(stash => stash.disabled === false);
                        stashes = notDisabled;
                    }
                });
        } catch (error) {
            console.log("ALERT! Error finding stashes " + error);
        }

        return stashes;
    }

    getFoundStashes = async (currentUser) => {

        let found = [];

        if (currentUser) {
            try {
                await Firebase.database()
                    .ref('/users/' + currentUser.uid + "/foundStashes")
                    .once('value', snapshot => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            let s = Object.values(data);
                            found = s;
                        }
                    });
            } catch (error) {
                console.log("ALERT! Error finding found stashes " + error)
            }
        }

        return found;
    }

    getAllNonfoundStashes = async (currentUser) => {

        let all = await this.getAllStashes();
        let found = await this.getFoundStashes(currentUser);

        let nonfound = this.whichAreNotOnList(found, all);

        return nonfound;
    }

    getHiddenStashes = async (currentUser) => {

        let hidden = [];

        try {
            await Firebase.database()
                .ref('/stashes')
                .once('value', snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const s = Object.values(data);
                        hidden = s.filter(d => d.owner === currentUser.uid);
                    }

                });
        } catch (error) {
            console.log("ALERT! Error finding hidden stashes " + error);
        }

        return hidden;
    }

    //check which items from list X are not found on list Y
    whichAreNotOnList = (x, y) => {

        let notOnX = y;

        x.forEach(xItem => {
            if (y.length > 0) {
                y.forEach(yItem => {
                    if (xItem.key === yItem.key) {
                        notOnX = notOnX.filter(item => item.key !== xItem.key);
                    }
                })
            }
        });

        return notOnX;
    }

    saveStash = (stash) => {

        stash.created = new Date().toString();

        try {
            Firebase.database().ref('stashes/' + stash.key).set(
                stash
            );
            Alert.alert("Stash saved");
            return true;
        } catch (error) {
            Alert.alert("Could not save stash");
            console.log("Error saving stash to database " + error);
            return false;
        }
    }

    saveFoundToUser = (stash, currentUser) => {
        try {
            Firebase.database().ref('users/' + currentUser.uid + "/foundStashes/" + stash.key).set(
                {
                    latitude: stash.latitude,
                    longitude: stash.longitude,
                    title: stash.title,
                    description: stash.description,
                    owner: stash.owner,
                    disabled: stash.disabled,
                    key: stash.key,
                    circleLat: stash.circleLat,
                    circleLong: stash.circleLong,
                    photoURL: stash.photoURL,
                    created: stash.created,
                    found: new Date().toString()
                }
            );
        } catch (error) {
            console.log("Error saving stash to found by user " + error);
        }
    }

    newStash = async () => {

        let s = {
            latitude: null,
            longitude: null,
            title: '',
            description: '',
            owner: null,
            disabled: false,
            circleLat: null,
            circleLong: null,
            key: null,
            photoURL: '',
            created: null,
        }

        s.owner = firebaseAuth.currentUser.uid;
        s.key = await this.getKey();

        return s;
    }

    getKey = async () => {
        try {
            let key = await Firebase.database().ref('stashes/').push().getKey();
            return key;
        } catch (error) {
            console.log("Error generating key " + error);
        }
    }
}
const fetchStashes = new FetchStashes();
export default fetchStashes;
