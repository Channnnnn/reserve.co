
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyCAn14rbTe1hfGzVQWJkrazqG5t6RTuO-Q",
    authDomain: "reserve405.firebaseapp.com",
    databaseURL: "https://reserve405.firebaseio.com",
    projectId: "reserve405",
    storageBucket: "reserve405.appspot.com",
    messagingSenderId: "514103369303"
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {firebaseApp, db, auth, storage}

