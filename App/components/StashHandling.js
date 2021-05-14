import Firebase from '../config/Firebase';

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

}
const fetchStashes = new FetchStashes();
export default fetchStashes;
