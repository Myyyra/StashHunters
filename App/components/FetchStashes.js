import Firebase from '../config/Firebase';

class FetchStashes {

    findStashes = async () => {

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

}
const fetchStashes = new FetchStashes();
export default fetchStashes;
