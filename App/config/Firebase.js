import * as firebase from 'firebase/app';
import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    MESSAGE_SENDER_ID,
    APP_ID
} from '@env';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: '',
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
}
// Initialize Firebase

//let Firebase = firebase.initializeApp(firebaseConfig);

let Firebase = null;
if (!firebase.apps.length) {
    Firebase = firebase.initializeApp(firebaseConfig);
  } else {
    Firebase = firebase.app(); // if already initialized, use that one
} 

export default Firebase;