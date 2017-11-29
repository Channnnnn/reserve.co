import {db, auth} from "@/scripts/firebase_config.js"

var _username;
var _phoneNumber;

//Get Current UNIX Timestamp
var getCurrentUnixTimestamp = function() {

    return parseInt(Date.now()/1000)
}

//Check Should be History
var checkShouldBeHistory = function(timestamp) {
    
    if(!timestamp) {
        return false
    }
    else {
        return getCurrentUnixTimestamp() - timestamp > 86400;
    }
}

//Get User Data
var getUserID = function() {

    if(auth.currentUser) {
        //console.log(auth.currentUser.uid)
        return auth.currentUser.uid
    }
    else {
        console.log("Error while getting User's ID");
        return null
    }
}

//Register New User
var addNewUser = function(username, phoneNumber, email, password) {
    auth.createUserWithEmailAndPassword(email, password).then(function() {
        console.log("Registering Complete");

        _username = username;
        _phoneNumber = phoneNumber;

        signIn(email, password, true);
        
    }).catch(function(error) {
        console.log("Error while Registering New User");
        console.log(error.code);
    });
}

//Sign In With Username
var signInWithUsername = function(username, password) {
    var ref = db.ref("users");

    ref.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.username == username) {
                signIn(childData.email, password, false);
            }
        });

    }).catch(function(error) {
        console.log("Error while retriving Username");
        console.log(error.code);
    });
}

//Sign In
var signIn = function(email, password, isComingFromRegister) {
    auth.signInWithEmailAndPassword(email, password).then(function() {
        console.log("Signed In");

        if(isComingFromRegister) {
            updateProfile(_username, email, password, "", "", _phoneNumber, true);            
        }

    }).catch(function(error) {
        console.log("Error while Signing In");
        console.log(error.code);
    });

}

//Sign Out
var signOut = function() {
    auth.signOut().then(function() {
        console.log("Signed Out");

    }).catch(function(error) {
        console.log("Error while Signing Out");
        console.log(error.code);
    });
}

//Get User's Info
var getUserInfo = function() { 
    var ref = db.ref("users/" + getUserID());
    var snapValue;
    
    ref.once("value", function(snapshot) {
        snapValue = snapshot.val();

    }, function(error) {
        console.log("Error while retriving User's Info");
        console.log(error.code);
    });

    return {data: snapValue};
}

//Get Current Queuing
var getUserReservation = function() {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];

    ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.user_id == getUserID() && !checkShouldBeHistory(key)) {
                snapValue.push(childData)
            }
        });

    }, function(error) {
        console.log("Error while retriving Reservation");
        console.log(error.code);
    });

    return {data: snapValue};
}

//Get Queuing History
var getUserHistory = function() {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];
    var keyForExpired = [];

    ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            
            if(childData.user_id == getUserID() && checkShouldBeHistory(key)) {

                if(childData.accepted == null && childData.expired == null) {
                    childData.expired = true;
                }
                
                snapValue.push(childData);
            }
        });

    }, function(error) {
        console.log("Error while retriving History")
        console.log(error.code);
    });

    return {data: snapValue};
}

//Get Shop's Info
var getShopInfo = function(sid) {
    var ref = db.ref("shops/" + sid);
    var snapValue;
    
    ref.once("value", function(snapshot) {
        snapValue = snapshot.val();

    }, function(error) {
        console.log("Error while retriving Shop's Info")
        console.log(error.code);
    });

    return {data: snapValue};
}

//Get Shop's Queues
var getShopQueues = function(sid) {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];

    ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.shop_id == sid && !checkShouldBeHistory(key)) {
                snapValue.push(childData)
            }
        });

    }, function(error) {
        console.log("Error while retriving Shop's Queues")
        console.log(error.code);
    });

    return {data: snapValue};
}
//Add Queue
var addQueue = function(sid) {
    
    var currentQueue;
    var currentTime = getCurrentUnixTimestamp();

    var ref = db.ref("shops/" + sid);
    ref.once("value", function(snapshot) {
        var snapValue = snapshot.val();
        if(checkShouldBeHistory(snapValue.current_queue_time)) {
            currentQueue = 0;
        }
        else {
            currentQueue = snapValue.current_queue;
        }
        
        var ref = db.ref("queues");
        ref.child(currentTime).set({
            waiting: true,
            shop_id: sid,
            user_id: getUserID(),
            queue_number: currentQueue + 1
    
        }).then(function() {
            console.log("Add Queue Complete");
            
            var ref = db.ref("shops/" + sid);
            ref.update({
                "current_queue": currentQueue + 1,
                "current_queue_time": currentTime
                
            }).then(function() {
                console.log("Update Shop's Current Queue Complete");
        
            }).catch(function(error) {
                console.log("Error while Updating Shop's Current Queue");
        
            });
    
        }).catch(function(error) {
            console.log("Error while Adding Queue");
    
        });

    }, function(error) {
        console.log("Error while Adding Queues")
        console.log(error.code);
    });
}

//Update Queue
var updateQueue = function(qid, action) {
    
    var ref = db.ref("queues");
    var actionValid = true

    switch (action) {
        case "accept":
            ref.child(qid).update({
                "accepted": true
            });
            break;
        
        case "cancel":
            ref.child(qid).update({
                "canceled": true
            });
            break;
            
        case "expire":
            ref.child(qid).update({
                "expired": true
            });
            break;
    
        default:
            console.log("Invalid 'action', action' must be only 'accept', 'cancel', or 'expire'");
            actionValid = false;
            break;
    }

    if(actionValid) {
        ref.child(qid).update({
            "waiting": false,
            update_timestamp: getCurrentUnixTimestamp()
            
        }).then(function() {
            console.log("Update Queue's Data Complete");
    
        }).catch(function(error) {
            console.log("Error while Updating Queue's Data");
    
        });
    }
}

//Update Profile
var updateProfile = function(username, email, password, firstName, lastName, phoneNumber, pushNotification) {

    var ref = db.ref("users");

    ref.child(getUserID()).update({
        "username": username,
        "email": email,
        "first_name": firstName,
        "last_name": lastName,
        "phone_number": phoneNumber,
        "push_notification": pushNotification

    }).then(function() {
        console.log("Update Profile on FRTDB Complete");
        
            var user = auth.currentUser;
        
            //Update Profile
            user.updateProfile({
                displayName: firstName + " " + lastName,
                photoURL: ""
            }).then(function() {
                console.log("Update Profile on FAuth Complete");
                
                    //Update Email
                    user.updateEmail(email).then(function() {
                        console.log("Update Email on FAuth Complete");
                        
                            //Update Password
                            user.updatePassword(password).then(function() {
                                console.log("Update Password on FAuth Complete");
                        
                            }).catch(function(error) {
                                console.log("Error while Updating Password on FAuth");
                                
                            });
                
                    }).catch(function(error) {
                        console.log("Error while Updating Email on FAuth");
                        
                    });
        
            }).catch(function(error) {
                console.log("Error while Updating Profile on FAuth");
                
            });

    }).catch(function(error) {
        console.log("Error while Updating Profile on FRTDB");

    });
}

//Update Shop's Info
var updateShopInfo = function(sid, name, description, staffs, phoneNumber, capacity, openTime, closeTime, serviceDays) {
 
    var ref = db.ref("shops");
    
    ref.child(sid).update({
        "name": name,
        "description": description,
        "owner": getUserID(),
        "staffs": staffs,
        "phone_number": phoneNumber,
        "capacity": capacity,
        "open_time": openTime,
        "close_time": closeTime,
        "service_days": serviceDays
        
    }).then(function() {
        console.log("Update Shop's Info Complete");

    }).catch(function(error) {
        console.log("Error while Updating Shop's Info");

    });
}

//Add New Shop
var addNewShop = function(sid, name, description, staffs, phoneNumber, capacity, openTime, closeTime, serviceDays) {

    var ref = db.ref("shops");

    ref.child(sid).set({
        "name": name,
        "description": description,
        "owner": getUserID(),
        "staffs": staffs,
        "phone_number": phoneNumber,
        "capacity": capacity,
        "open_time": openTime,
        "close_time": closeTime,
        "service_days": serviceDays,
        "current_queue": 0,
        "current_queue_time": 0
        
    }).then(function() {
        console.log("Add New Shop Complete");

    }).catch(function(error) {
        console.log("Error while Adding New Shop");

    });
}

//Check Existing User's Username
var checkUserUsernameAvailability = function(username, callback) {
    
    var ref = db.ref("users");
    
    ref.once("value").then(function(snapshot) {
        let avalability = true;

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
    
            if(childData.username.toLowerCase() == username.toLowerCase()) {
                avalability = false;
            }
        });

        callback(avalability);
    
    }).catch(function(error) {
        console.log("Error while retriving User's Username");
        console.log(error.code);
        callback(false);
    });
}

//Check Existing Shop's Username
var checkShopUsernameAvailability = function(username, callback) {
    
    var ref = db.ref("shops");
    
    ref.once("value").then(function(snapshot) {
        let avalability = true;

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
    
            if(key.toLowerCase() == username.toLowerCase()) {
                avalability = false;
            }
        });

        callback(avalability);
    
    }).catch(function(error) {
        console.log("Error while retriving Shop's Username");
        console.log(error.code);
        callback(false);
    });
}

export {
            addNewUser,
            signIn,
            signInWithUsername,
            signOut,
            getUserID,
            getUserInfo, 
            getUserReservation, 
            getUserHistory, 
            getShopInfo, 
            getShopQueues, 
            addQueue,
            updateQueue,
            updateProfile,
            updateShopInfo,
            addNewShop,
            checkUserUsernameAvailability,
            checkShopUsernameAvailability
}