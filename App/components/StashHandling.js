import Firebase from '../config/Firebase';
import { rules } from '../GameRules.js';

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

    saveStash = (stash, currentUser) => {
        try {
            Firebase.database().ref('stashes/' + stash.key).set(
                {
                    latitude: stash.latitude,
                    longitude: stash.longitude,
                    title: stash.title,
                    description: stash.description,
                    owner: currentUser.uid,
                    disabled: false,
                    key: stash.key,
                    circleLat: this.randomCenter(stash).latitude,
                    circleLong: this.randomCenter(stash).longitude,
                    photoURL: stash.photoURL,
                    created: new Date().toString()
                }
            );
        } catch (error) {
            console.log("Error saving stash to database " + error);
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

    randomCenter = (stash) => {
        let latitude = stash.latitude;
        let longitude = stash.longitude;
        let diff = rules.circleRad * 0.0000081; // constant number was calculated to adjust lat and long numbers to meters

        let x = latitude + (Math.random() * diff);
        let y = longitude + (Math.random() * diff);

        return { latitude: parseFloat(x), longitude: parseFloat(y) }; // modifies randomized numbers to adhere to convention of showing lat and long with 7 decimal points
    }

    getKey = () => {
        try {
            return Firebase.database().ref('stashes/').push().getKey();
        } catch (error) {
            console.log("Error generating key " + error);
        }
    }

}
const fetchStashes = new FetchStashes();
export default fetchStashes;
