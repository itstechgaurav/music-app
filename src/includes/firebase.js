import firebase from 'firebase/app';

require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

const firebaseConfig = {
  apiKey: 'AIzaSyDCqYoYnGu6IK2JrShGxbfWJuCWAL2IjyQ',
  authDomain: 'music-63dee.firebaseapp.com',
  projectId: 'music-63dee',
  storageBucket: 'music-63dee.appspot.com',
  appId: '1:592229703318:web:40fa8d07f36ea5924e6cb7',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const { firestore } = firebase;
const storage = firebase.storage();

// console.log(firebase);

// collections

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  auth, usersCollection, songsCollection, commentsCollection, storage, firestore,
};
