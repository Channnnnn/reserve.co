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

exports.updateProfile = function(username, email, password, firstName, lastName, phoneNumber, pushNotification, callback) {
    var ref = firebase.database().ref('users');
    var user = auth.currentUser;

    var dbResult, emailResult, passwordResult, profileResult;
    ref.child(user.uid).update({
        "username": username,
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "phone_number": phoneNumber,
        "push_notification": pushNotification
        })
        .then(function () {
            console.info("Update Profile complete");
            dbResult = {success : true};
        })
        .catch((err) => {
            console.error("Update Profile failed");
            dbResult = {success : false, error: err};
        });
    user.updateEmail(email)
        .then( () => {
            console.info("Email updated");
            emailResult = {success : true};
        })
        .catch( (err) => {
            console.error("Fails to update email");
            emailResult = {success : false, error: err};
        });
    user.updatePassword(password)
        .then( () => {
            console.info("Password updated");
            passwordResult = {success : true};
        })
        .catch( (err) => {
            console.error("Fails to update password");
            passwordResult = {success : false, error: err};
        });
    user.updateProfile({
            displayName: firstName + " " + lastName,
            photoURL: '',
        })
        .then( () => {
            console.info("Profile updated");
            profileResult = {success : true};
        })
        .catch( (err) => {
            console.error("Fails to update profile");
            profileResult = {success : false, error: err};
        });
    return {
        success: dbResult.success && emailResult.success && passwordResult.success && profileResult.success,
        DBResult: dbResult,
        EmailResult: emailResult,
        PasswordResult: passwordResult,
        ProfileResult: profileResult
    }        
}

exports.SignInWithUsername = function(username, password) {
    var ref = db.ref("users");
    var processedCount = 0;
    var found = false;

    ref.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            processedCount++;

            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.username == username) {
                found = true;
                return exports.SignIn(childData.email, password, false);
            }
            if(processedCount == snapshot.numChildren() && !found) {
                return false;
            }
        });

    }).catch(function(error) {
        console.log("Error while retrieving Username");
        console.log(error);
        return false;
    });
}

exports.SignIn = function(email, password, isComingFromRegister) {
    auth.signInWithEmailAndPassword(email, password).then(function() {
        console.log("Signing In...");

        if(isComingFromRegister) {
            updateProfile(_username, email, password, _username, "", _phoneNumber, true, function(result) {});
            return 'unknown';       
        }
        else {
            console.log("Signed In");
            return true;
        }

    }).catch(function(error) {
        console.log("Error while Signing In");
        console.log(error);
        return false;
    });

}