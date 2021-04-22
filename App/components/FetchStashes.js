import React, { Component, useState } from 'react';
import { Alert } from 'react-native';
import Firebase from '../config/Firebase';

class FetchStashes {

    findStashes = async () => {

        let stashes = [];

        try {
            await Firebase.database()
                .ref('/stashes')
                .once('value', snapshot => {
                    const data = snapshot.val();
                    const s = Object.values(data);
                    const filtered = s.filter(stash => stash.disabled === false);
                    stashes = filtered;
                    console.log("finding done");
                });
        } catch (error) {
            console.log("ALERT! Error finding stashes " + error);
        }

        return stashes;
    }

}
const fetchStashes = new FetchStashes();
export default fetchStashes;
