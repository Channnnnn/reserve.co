import {db} from "@/scripts/firebase_config.js"

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

//Get User's Info
var getUserInfo = function(uid) { 
    var ref = db.ref("users/" + uid);
    var snapValue;
    
    ref.on("value", function(snapshot) {
        snapValue = snapshot.val();
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return {data: snapValue};
}

//Get Current Queuing
var getUserReservation = function(uid) {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.user_id == uid && !checkShouldBeHistory(key)) {
                snapValue.push(childData)
            }
        });
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return {data: snapValue};
}

//Get Queuing History
var getUserHistory = function(uid) {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.user_id == uid && checkShouldBeHistory(key)) {
                snapValue.push(childData)
            }
        });
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return {data: snapValue};
}

//Get Shop's Info
var getShopInfo = function(sid) {
    var ref = db.ref("shops/" + sid);
    var snapValue;
    
    ref.on("value", function(snapshot) {
        snapValue = snapshot.val();
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return {data: snapValue};
}

//Get Shop's Queues
var getShopQueues = function(sid) {
    var ref = db.ref("queues").orderByKey();
    var snapValue = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            if(childData.shop_id == sid && !checkShouldBeHistory(key)) {
                snapValue.push(childData)
            }
        });
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return {data: snapValue};
}

//Get Current Shop's Queue Number
var getCurrentQueueNumber = function(sid) {

    var currentQueue;
    
    var ref = db.ref("shops/" + sid);    
    ref.on("value", function(snapshot) {
        var snapValue = snapshot.val();
        currentQueue = snapValue.current_queue;
    }, function(errorObject) {
        console.log("Error: " + errorObject.code)
    });

    return currentQueue
}

//Add Queue
var addQueue = function(uid, sid) {
    
    var currentQueue = getCurrentQueueNumber(sid);
    
    var ref = db.ref("queues");
    ref.child(getCurrentUnixTimestamp()).set({
        waiting: true,
        shop_id: sid,
        user_id: uid,
        queue_number: currentQueue + 1
    });
    
    var ref = db.ref("shops/" + sid);
    ref.update({
        "current_queue": currentQueue + 1
    });
}

//Update Queue
var updateQueue = function(qid, action) {
    
    var ref = db.ref("queues");

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
            break;
    }

    ref.child(qid).update({
        "waiting": false,
        update_timestamp: getCurrentUnixTimestamp()
    });
}

//Update Profile
var updateProfile = function(uid, email, password, firstName, lastName, phoneNumber, pushNotification) {

    var ref = db.ref("users");

    ref.child(uid).update({
        "email": email,
        "password": password,
        "first_name": firstName,
        "last_name": lastName,
        "phone_number": phoneNumber,
        "push_notification": pushNotification
    });
}

//Update Shop's Info
var updateShopInfo = function(sid, name, description, owner, staffs, phoneNumber, capacity, openTime, closeTime, serviceDays) {
 
    var ref = db.ref("shops");
    
    ref.child(sid).update({
        "name": name,
        "description": description,
        "owner": owner,
        "staffs": staffs,
        "phone_number": phoneNumber,
        "capacity": capacity,
        "open_time": openTime,
        "close_time": closeTime,
        "service_days": serviceDays
    });
}

export {
            getUserInfo, 
            getUserReservation, 
            getUserHistory, 
            getShopInfo, 
            getShopQueues, 
            addQueue,
            updateQueue,
            updateProfile,
            updateShopInfo
}