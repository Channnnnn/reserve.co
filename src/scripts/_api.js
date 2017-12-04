// var firebase = require("firebase");

// var config = {
//     apiKey: "AIzaSyCAn14rbTe1hfGzVQWJkrazqG5t6RTuO-Q",
//     authDomain: "reserve405.firebaseapp.com",
//     databaseURL: "https://reserve405.firebaseio.com",
//     projectId: "reserve405",
//     storageBucket: "reserve405.appspot.com",
//     messagingSenderId: "514103369303"
// };

// const firebaseApp = firebase.initializeApp(config);
// const db = firebaseApp.database();
// const auth = firebaseApp.auth();

import {db, auth} from "@/scripts/firebase_config.js"

// exports.updateProfile = function(username, email, password, firstName, lastName, phoneNumber, pushNotification, callback) {
//     var ref = firebase.database().ref('users');
//     var user = auth.currentUser;

//     var dbResult, emailResult, passwordResult, profileResult;
//     ref.child(user.uid).update({
//         "username": username,
//         "email": email,
//         "first_name": firstName,
//         "last_name": lastName,
//         "phone_number": phoneNumber,
//         "push_notification": pushNotification
//         })
//         .then(function () {
//             console.info("Update Profile complete");
//             dbResult = {success : true};
//         })
//         .catch((err) => {
//             console.error("Update Profile failed");
//             dbResult = {success : false, error: err};
//         });
//     user.updateEmail(email)
//         .then( () => {
//             console.info("Email updated");
//             emailResult = {success : true};
//         })
//         .catch( (err) => {
//             console.error("Fails to update email");
//             emailResult = {success : false, error: err};
//         });
//     user.updatePassword(password)
//         .then( () => {
//             console.info("Password updated");
//             passwordResult = {success : true};
//         })
//         .catch( (err) => {
//             console.error("Fails to update password");
//             passwordResult = {success : false, error: err};
//         });
//     user.updateProfile({
//             displayName: firstName + " " + lastName,
//             photoURL: '',
//         })
//         .then( () => {
//             console.info("Profile updated");
//             profileResult = {success : true};
//         })
//         .catch( (err) => {
//             console.error("Fails to update profile");
//             profileResult = {success : false, error: err};
//         });
//     return {
//         success: dbResult.success && emailResult.success && passwordResult.success && profileResult.success,
//         DBResult: dbResult,
//         EmailResult: emailResult,
//         PasswordResult: passwordResult,
//         ProfileResult: profileResult
//     }        
// }
const funcs = {
    _GetCurrentUser() {
        console.log(auth.currentUser);
        return auth.currentUser;
    },
    _GetCurrentUserID() {
        return auth.currentUser.uid;
    },
    _GetCurrentUserInfo() { 
        console.log(this._GetCurrentUserID());
        var ref = db.ref("users/" + this._GetCurrentUserID());
        console.log(ref);
        ref.once("value", function(snapshot) {
            console.log(snapshot.val());
            return snapshot.val();
        }, function(error) {
            console.log("Error while retrieving User's Info\n" + error.code);
        });
    },
    _GetUserAllReservations() {
        // console.log(user);
        var ref = db.ref("queues").orderByKey();
        var snapCollection = [];
    
        ref.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(this._GetCurrentUserID());
                if(childData.user_id == this._GetCurrentUserID()) {
                    let item = Object.assign({key: key}, childData);
                    snapCollection.push(item)
                }
            });
            return snapCollection
    
        }, function(error) {
            console.log("Error while retrieving Reservation\n" + error.code);
            return error
        });
    },

    
    _CheckShouldBeHistory(timestamp) {
        if (!timestamp){
            return false;
        }
        else {
            let unixTime = parseInt(Date.now()/1000);
            return unixTime - timestamp > 86400;
        }
    },

    _FilterReservations(reservations) {
        var filtered = [];
        reservations.forEach((item)=>{
            if (!this._CheckShouldBeHistory(item.key)){
                filtered.push(item);
            }
        });
        return filtered;
    },

    _FilterHistory (reservations) {
        var filtered = [];
        reservations.forEach((item)=>{
            if (this._CheckShouldBeHistory(item.key)){
                filtered.push(item);
            }
        });
        return filtered;
    }
}

export default funcs