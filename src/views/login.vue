<template>
  <div class="login-dialog">
    <div class="header" :class="{'completed' : completed}">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <keep-alive><transition name="fade" mode="out-in">
      <div v-if="isRegister" class="registerDialog" key="reg">
        <h2>Create new account</h2>
        <div class="form">
          <div class="bundle">
            <input v-model="register.username" v-validate="'required|alpha_num'" data-vv-delay="1000"
            :class="{'invalid' : fields.username && (!fields.username.pending &&
              ((fields.username.invalid && (fields.username.dirty||fields.username.touched)) || 
              this.warnReg.validUsername.length > 1))}" 
            type="text" name="username" id="username" required />
            
            <label for="username">Username</label>
            <span v-show=" fields.username && (!fields.username.pending && ((errors.has('username') ||
              this.warnReg.validUsername.length > 1)))" class="notifier">
              {{errors.first('username') || this.warnReg.validUsername}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.email" v-validate="'required|email'"
            :class="{'invalid' : fields.email && (!fields.email.pending &&
              ((fields.email.invalid && (fields.email.dirty||fields.email.touched)) ||
              this.warnReg.validEmail))}" 
            type="text" name="email" id="email" required />
            
            <label for="email">Email</label>
            <span v-show=" fields.email && (!fields.email.pending && (errors.has('email') ||
              this.warnReg.validEmail))" class="notifier">
              {{errors.first('email') || this.warnReg.validEmail}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.phone" v-validate="'required'" data-vv-delay="1000"
            :class="{'invalid' : fields.phone && (!fields.phone.pending &&
              ((fields.phone.invalid && (fields.phone.dirty||fields.phone.touched)) || 
              this.warnReg.validPhone.length > 1))}" 
            type="text" name="phone" id="phone" required />
            
            <label for="phone">Phone No.</label>
            <span v-show=" fields.phone && (!fields.phone.pending && (errors.has('phone') ||
              this.warnReg.validPhone.length > 1))" class="notifier">
              {{errors.first('phone') || this.warnReg.validPhone}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.password1" v-validate="'required'" data-vv-delay="1000"
            :class="{'invalid' : fields.Password && (!fields.Password.pending &&
              ((fields.Password.invalid && (fields.Password.dirty||fields.Password.touched)) || 
              this.warnReg.validPassword.length > 1))}" 
            type="password" name="Password" id="password1" required />
            
            <label for="password1">Password</label>
            <span v-show=" fields.Password && (!fields.Password.pending && (errors.has('Password') || 
              this.warnReg.validPassword.length > 1))" class="notifier">
              {{errors.first('Password') || this.warnReg.validPassword}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.password2" v-validate="'required|confirmed:Password'" data-vv-delay="1000"
            :class="{'invalid' : fields.password && (!fields.password.pending &&
              ((fields.password.invalid && (fields.password.dirty||fields.password.touched)) ||
              this.warnReg.matchPassword.length > 1))}" 
            type="password" name="password" id="password2" required />
            
            <label for="password2">Confirm Password</label>
            <span v-show=" fields.password && (!fields.password.pending && (errors.has('password') ||
              this.warnReg.matchPassword.length > 1))" class="notifier">
              {{errors.first('password') || this.warnReg.matchPassword}}
            </span>
          </div>
          <a @click="validateBeforeRegister" class="button green">Register</a>
        </div>
      </div>
      
      <div v-if="isLogin" class="loginDialog" key="log">
        <div class="form">
          <div class="bundle">
            <input required v-model="login.username" type="text" id="u-name" name="Username" />
            <label for="u-name">Username</label>
            <span v-show="warnLog.hasUsername != ''" class="notifier">
              {{warnLog.hasUsername}}
            </span>
          </div>
          <div class="bundle">
            <input required v-model="login.password" type="password" id="u-pass" name="Password"
              @keyup.enter="loginAuthentication" />
            <label for="u-pass">Password</label>
            <span v-show="warnLog.hasPassword != ''" class="notifier">
              {{warnLog.hasPassword}}
            </span>
          </div>
          <a class="button blue" @click="loginAuthentication">Login</a>
        </div>
      </div>
      </transition></keep-alive>
      <a @click="registerDialog" class="button green" v-if="!isRegister && !isLogin">Register</a>
      <a @click="registerDialog" class="button transparent green" v-if="!isRegister && isLogin">or Register new account</a>
      <a @click="loginDialog" class="button blue" v-if="!isRegister && !isLogin">Login</a>
      <a @click="loginDialog" class="button transparent blue" v-if="isRegister && !isLogin">or Login with your account</a>
      <div class="divider">OR CONNECT WITH</div>
      <div class="button-row">
        <a class="button facebook disabled">Facebook</a>
        <a class="button google disabled">Google</a>
      </div>
      <div class="section">
        <a class="button wide transparent blue disabled">LOGIN AS GUEST</a>
      </div>
    </div>
    <div class="footer">
      <span>Reserve.co © 2017</span>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Help</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import vee from 'vee-validate'
import VeeConfig from '@/scripts/vee_config.js'
import {
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
            checkShopUsernameAvailability,
            checkAlreadyInQueue,
            checkIfInInterval
} from "@/scripts/api.js"
import {db,auth,storage} from '@/scripts/firebase_config';

Vue.use(vee,VeeConfig);

export default {
  name: 'login',
  data() {
    return{
      delay: 1000,
      isRegister: false,
      isLogin: false,
      register: {
        username: '',
        email: '',
        phone: '',
        password1: '',
        password2: '',
      },
      login: {
        username: '',
        password: '',
      },
      warnReg: {
        validUsername: '',
        validEmail: '',
        validPhone: '',
        validPassword: '',
        matchPassword: '',
      },
      warnLog: {
        hasUsername: '',
        hasPassword: ''
      },
      completed: false,
    }
  },
  watch: {
    user: '_CheckAuth',

    'register.username': _.debounce(function(){
      var self = this;
      var regex = /^[a-zA-Z0-9]{4,25}$/
      if(!self.register.username.match(regex) && self.register.username){
        self.warnReg.validUsername = 'Username length must be 4-25 characters.';
      } 
      else { 
        var usernameQuery = db.ref('users')
          .orderByChild('username')
          .equalTo(self.register.username);
        usernameQuery.once('value', function(snap){
          if (snap.val() && self.register.username){
            self.warnReg.validUsername = "This username has already taken."
          }
        })
        self.warnReg.validUsername = '';
      }
    },
    this.delay),

    'register.phone': _.debounce(function(){
      var regex = /^0(\d\s*){9}$/
      if (!this.register.phone.match(regex) && this.register.phone){
        this.warnReg.validPhone = 'Phone number must be 10-digits format. (0XX XXX XXXX)';
      } else { this.warnReg.validPhone = ''; }
    },
    this.delay),

    'register.password1': _.debounce(function(){
      var regex = /^.{6,}$/
      if( !this.register.password1.match(regex) && this.register.password1){
        this.warnReg.validPassword = 'Password length must be at least 6 characters.';
      } else { this.warnReg.validPassword = '';}
    },
    this.delay),

    'register.email': _.debounce(function(){
      if ( this.fields.email.invalid && this.register.email ){
        this.warnReg.validEmail = this.errors.first('email');
      } else { this.warnReg.validEmail = ''; }
    },
    this.delay),

    'login.username': function(){
      if (this.login.username.length > 0) {
        this.warnLog.hasUsername = '';
      }
    },

    'login.password': function(){
      if (this.login.password.length > 0) {
        this.warnLog.hasPassword = '';
      }
    },
  },
  computed: {
    user: function(){
      return this.$store.getters.HasAuth;
    },
    warnRegClean: function(){
      var allwarn = this.warnReg.validUsername + this.warnReg.validEmail + this.warnReg.validPhone + this.warnReg.validPassword + this.warnReg.matchPassword;
      if (allwarn.length === 0) { return true; }
      else return false;
    }
  },
  methods: {
    _CheckAuth(){
      if (this.user) {
        this.$router.replace({name: 'account'});
      }
    },
    validateBeforeRegister(){
      let self = this;
      var payload = this.register;
      var formattedPhone = this.register.phone.replace(/\s/g, '').replace(/^0(\d{2})(\d{3})(\d{4})$/, '0$1 $2 $3');
      self.$store.dispatch('onLoadingAsync',true);
      this.$validator.validateAll().then((result) => {
        if (result && this.warnRegClean){
          console.log('Submitting registeration...');
          self._CreateNewUser(payload.username, payload.email, payload.password1, formattedPhone)
        }
        else {  
          self.$store.dispatch('onLoadingAsync',false);
          alert('Please correct all errors and try again.');
        }
      });
    },

    loginAuthentication(){
      let self = this;

      if (self.login.username.length === 0) {
        self.warnLog.hasUsername = 'Please enter username.'
      }
      if (self.login.password.length === 0) {
        self.warnLog.hasPassword = 'Please enter password.'
      }
      if (self.warnLog.hasPassword + self.warnLog.hasUsername != '') {
        return;
      }


      var payload = this.login;
      var ref = db.ref("users");
      self.$store.dispatch('onLoadingAsync',true);
      ref.once("value")
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.val().username == payload.username) {
              self._SignInThenRedirect(childSnapshot.val().email, payload.password);
            }
          });
        })
        .catch((error) => {
          self.$store.dispatch('onLoadingAsync',false);
          console.log("Error while retrieving Username\n" + error);
          alert(error);
        });
    },

    // loginAsGuest(){
    //   auth.signInAnonymously().catch(function(error) {
    //     console.log(error.message);
    //   });
    // },

    /**
     * 
     * Internal methods
     * 
     * **/
    
    _CreateNewUser(username, email, password, phone){
      let self = this;
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log("User created");
          auth.signInWithEmailAndPassword(email, password)
            .then(() => {
              self._CreateNewDatabase(username, email, phone);
              self._CreateNewProfileThenRedirect(username);
            })
            .catch(error => {
              self.$store.dispatch('onLoadingAsync',false);
              console.log("Unable to Signing In\n" + error);
            });
        })
        .catch(err=>{
          self.$store.dispatch('onLoadingAsync',false);
          console.log("Error while Registering New User\n" + error);
        });
    },
    _SignInThenRedirect(email, password){
      let self = this;
      auth.signInWithEmailAndPassword(email, password)
        .then(function() {
          self.completed = true;
          self.$store.dispatch('onAuthChanged');
          //Signed in Fetch data
          var userDataRef = db.ref('users/' + self.$store.getters.HasAuth.uid);
          userDataRef.on("value", function(snap){
            //Fetch complete
            self.$store.dispatch('onSyncUserData', snap.val());
            self.$store.dispatch('onLoadingAsync',false);

            if (self.$store.getters.GetRedirectPath){
              var redirect = self.$store.getters.GetRedirectPath;
              console.log('Redirect to ' + redirect);
              self.$store.dispatch('completedRedirect');
              self.$router.push(redirect);
              window.location.reload();
            }
            else{
              console.log('Entering account');
              self.$router.push({name: 'account'});
              window.location.reload();
            }

          }), function(err) { console.log('Error getting user data\n' + err.code) }

        })
        .catch(function(error) {
          self.$store.dispatch('onLoadingAsync',false);
          console.log("Error while Signing In\n" + error);
          self.$store.dispatch('onLoadingAsync',false);
          alert(error);
        });
    },

    _CreateNewDatabase(newUsername, newEmail, newPhoneNumber){
      var ref = db.ref('users');
      ref.child(auth.currentUser.uid)
        .update(
          {
            "username": newUsername,
            "email": newEmail,
            "display_name": newUsername,
            "phone_number": newPhoneNumber,
            "push_notification": true,
            "shop_list" : []
        })
        .then(() => { console.log("Profile on Realtime-DB Created"); })
        .catch(err => { console.error("Creating profile in Realtime-DB failed\n" + err) });
    },
    _CreateNewProfileThenRedirect(newName){
      var self = this;
      auth.currentUser.updateProfile({
        displayName: newName,
        photoURL: '/user-avatar.gif'
        })
        .then(()=>{ 
          self.completed = true;
          console.log('Profile Created');
          self.$store.dispatch('onLoadingAsync',false);
          self.$store.dispatch('onAuthChanged');
          self.$router.push({name: 'account'});
          window.location.reload();
        })
        .catch(err => { 
          console.log('Createing profile in FAuth failed\n' + err); 
          self._RollbackRegisteration(auth.currentUser.uid);
        });
    },
    _RollbackRegisteration(userUID){
      var ref = db.ref('users/' + userUID);
      ref.remove()
        .then(() => { 
          console.log('Rollback registeration'); 
          self.$store.dispatch('onLoadingAsync',false);
        })
        .catch((err) => { 
          console.log('Rollback failed\n' + err);
          self.$store.dispatch('onLoadingAsync',false);
        });
    },
    registerDialog(){
      this.isRegister = true;
      this.isLogin = false;
    },
    loginDialog(){
      this.isLogin = true;
      this.isRegister = false;
    },
    checkUserUsernameAvailability(){
      checkUserUsernameAvailability("mekmekja", function(result) {
          console.log(result);
      });
    },
    checkShopUsernameAvailability(){
      checkShopUsernameAvailability("mekmek", function(result) {
          console.log(result);
      });
    },
    checkAlreadyInQueue(){
      checkAlreadyInQueue("MekMek", function(result) {
          console.log(result);
      });
    },
    checkIfInInterval(){

      var image;

      checkIfInInterval(image);
    },
    uploadImage(){
    
      var destination = 'avatar/' + getUserID() + '.jpg';

      //Image File From EventListener
      var task = storage.ref(destination).put(imageFile);

      task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      }, function error(err) {
        console.log("Error while retrieving Shop's Username");
        console.log(err.code);

      }, function complete() {
        var downloadUrl = task.snapshot.downloadUrl;

      });
    },
    getImageUrl(){
      
      var destination = 'avatar/' + getUserID() + '.jpg';

      storage.ref(destination).getDownloadURL().then(function(url) {
        var downloadUrl = url;
      });
    }
  },
  created(){
    this.$store.dispatch('onLoadingAsync',false);
  }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.section{
  margin: 1.5em 0;
}
.wide, .blue, .green{
  display: inline-block;
  width: 100% !important;
  padding: .75rem 0;
}
.login-dialog{
  display: flex;
  flex-flow: column;
  height: 100vh;
  width: 100% !important;
  margin: auto;
  align-items: center;
  justify-content: center;
  @media screen and (max-height: 880px) {
    justify-content: unset;
  }
  .header{
    margin-top: auto;
    font-size: 3.45em;
    color: $color-blue;
    transition: all .15s;
  }
  .completed{
    color: $color-green;
  }
  .subheader{
    font-size: 1.75em;
    line-height: 1em;
  }
  .button-group{
    display: grid;
    box-sizing: border-box;
    margin: 2em 0;
    padding: 0 1em;
    // width: 100%;
    grid-template-rows: auto;
    align-items: center;
    grid-gap: 10px;
  }
  .button-row{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
  }
  .button{
    user-select: none;
    &.green, &.blue{
      font-size: 1.25em;
      text-transform: uppercase;
    }
    &.transparent{
      font-size: 1rem;
      background-color: transparent !important;
      &.green{
        color: $color-green;
        border-color: $color-green;
      }
      &.blue{
        color: $color-blue;
        border-color: $color-blue;
      }
    }
  }
  .wide{
    font-size: 1.25em !important;
  }
  // .link{
  //   user-select: none;
  //   &.green{
  //     color: $color-green;
  //   }
  // }
  .divider{
    overflow: hidden;
    text-align: center;
    color: $color-grey;
    font-size: .75em;
    &::before, &::after {
      display: inline-block;
      content: "";
      height: 1px;
      position: relative;
      vertical-align: middle;
      width: 50%;
      background-color: $color-grey50;
    }
    &::before {
      right: .5em;
      margin-left: -50%;
    }
    &::after {
      left: .5em;
      margin-right: -50%;
    }
  }
  .footer{
    margin: .5em;
    margin-top: auto;
    ul{
      margin: 0;
    }
    li{
      margin: 0;
      &:not(:last-child):after{
        content: " · "
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
.form{
  display: grid;
  grid-template-rows: auto;
  grid-gap: 5px;
  .bundle{
    margin: 1em 0;
    position: relative;
    input{
      width: -webkit-fill-available !important;
      box-sizing: border-box;
      border: 0;
      box-shadow: 0 1px $color-grey50;
      outline: none;
      color: $color-grey;
      font-family: 'Kanit', sans-serif;
      font-weight: 300;
      font-size: 1em;
      transition: all .15s;
      &:focus, &:valid {
        box-shadow: 0 2px $color-blue50;
      }
      &:focus + label, &:valid + label {
        font-size: .8em;
        top: -1.25em;
        color: $color-blue;
      }
      &.invalid{
        box-shadow: 0 2px $color-orange;
        & + label{
          color: $color-orange;
        }
      }
    }
    
    label{
      display: block;
      position: absolute;
      color: $color-grey;
      transition: all .15s;
      top: 0em;
    }
    .notifier{
      display: block;
      position: absolute;
      font-size: .8em;
      color: $color-orange;
      transition: all .15s;
      top: 2.25em;
      text-align: center;
    }
  }
}
.facebook{
  background-color: hsl(221, 42%, 42%);
  &::before{
    font-family: 'FontAwesome';
    content: "\f230";
    margin-right: 5px;
  }
}
.google{
  background-color: hsl(5, 70%, 59%);
  &::before{
    font-family: 'FontAwesome';
    content: "\f1a0";
    margin-right: 5px;
  }
}
</style>

