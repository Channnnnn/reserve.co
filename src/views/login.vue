<template>
  <div class="login-dialog">
    <div class="header">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <transition name="fade" mode="out-in">
      <div v-if="isRegister" class="registerDialog" key="reg">
        <h2>Create new account</h2>
        <div class="form">
          <div class="bundle">
            <input v-model="register.username" v-validate="'required|alpha_num'" data-vv-delay=delay
            :class="{'invalid' : (fields.username.invalid && fields.username.touched) || this.warnReg.validUsername.length > 1}" 
            type="text" name="username" id="username" required />
            
            <label for="username">Username</label>
            <span v-show="(errors.has('username') || this.warnReg.validUsername.length > 1)" class="notifier">
              {{errors.first('username') || this.warnReg.validUsername}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.email" v-validate="'required|email'" data-vv-delay=delay
            :class="{'invalid' : fields.email.invalid && fields.email.touched}" 
            type="text" name="email" id="email" required />
            
            <label for="email">Email</label>
            <span v-show="errors.has('email')" class="notifier">
              {{errors.first('email')}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.phone" v-validate="'required'" data-vv-delay=delay
            :class="{'invalid' : (fields.phone.invalid && fields.phone.touched) || this.warnReg.validPhone.length > 1}" 
            type="text" name="phone" id="phone" required />
            
            <label for="phone">Phone No.</label>
            <span v-show="errors.has('phone') || this.warnReg.validPhone.length > 1" class="notifier">
              {{errors.first('phone') || this.warnReg.validPhone}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.passward1" v-validate="'required'" data-vv-delay=delay
            :class="{'invalid' : (fields.Password.invalid && fields.Password.touched) || this.warnReg.validPassword.length > 1}" 
            type="password" name="Password" id="password1" required />
            
            <label for="password1">Password</label>
            <span v-show="errors.has('Password') || this.warnReg.validPassword.length > 1" class="notifier">
              {{errors.first('Password') || this.warnReg.validPassword}}
            </span>
          </div>
          <!--  -->
          <div class="bundle">
            <input v-model="register.password2" v-validate="'required'" data-vv-delay=delay
            :class="{'invalid' : (fields.password.invalid && fields.password.touched) || this.warnReg.matchPassword.length > 1}" 
            type="password" name="password" id="password2" required />
            
            <label for="password2">Confirm Password</label>
            <span v-show="errors.has('password') || this.warnReg.matchPassword.length > 1" class="notifier">
              {{errors.first('password') || this.warnReg.matchPassword}}
            </span>
          </div>
          <a @click="validateBeforeRegister" class="button green">Register</a>
        </div>
      </div>

      <div v-if="isLogin" class="loginDialog" key="log">
        <div class="form">
          <div class="bundle">
            <input required v-model="login.username" type="text" id="u-name" name="username" />
            <label for="u-name">Username</label>
          </div>
          <div class="bundle">
            <input required v-model="login.password" type="text" id="u-pass" name="password" />
            <label for="u-pass">Password</label>
          </div>
          <a class="button blue" @click="loginAuthentacation">Login</a>
        </div>
      </div>
      </transition>
      <a @click="registerDialog" class="button green" v-if="!isRegister && !isLogin">Register</a>
      <a @click="registerDialog" class="button transparent green" v-if="!isRegister && isLogin">or Register new account</a>
      <a @click="loginDialog" class="button blue" v-if="!isRegister && !isLogin">Login</a>
      <a @click="loginDialog" class="button transparent blue" v-if="isRegister && !isLogin">or Login with your account</a>
      <div class="divider">OR CONNECT WITH</div>
      <div class="button-row">
        <a href="#" class="button facebook">Facebook</a>
        <a href="#" class="button google">Google</a>
      </div>
      <div class="section">
        <a class="button wide transparent blue">LOGIN AS GUEST</a>
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
            checkAlreadyInQueue
} from "@/scripts/api.js"

const config = {
    errorBagName: 'errors',
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'en',
    dictionary: null,
    strict: true,
    classes: false,
    classNames: {
        touched: 'touched',
        untouched: 'untouched',
        valid: 'valid',
        invalid: 'invalid',
        pristine: 'pristine',
        dirty: 'dirty'
    },
    events: 'input|blur',
    inject: true,
    validity: false,
    aria: true
};

Vue.use(vee,config);

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
        passward1: '',
        password2: '',
      },
      login: {
        username: '',
        password: '',
      },
      warnReg: {
        validUsername: '',
        validPhone: '',
        validPassword: '',
        matchPassword: '',
      }
    }
  },
  watch: {
    'register.username': _.debounce(function(){
      var regex = /^[a-zA-Z0-9]{4,25}$/
      if(!this.register.username.match(regex)){
        this.warnReg.validUsername = 'Password length must be 4-25 characters.';
      } else { this.warnReg.validUsername = '';}
    },
    this.delay),
    'register.phone': _.debounce(function(){
      if (this.register.phone === '') {
        this.warnReg.validPhone = 'Phone number required';
        return;
      }
      var regex = /^(0[0-9]{9})$/
      if (!this.register.phone.match(regex) && this.register.phone){
        this.warnReg.validPhone = 'Phone number must be 10-digits format.';
      } else { this.warnReg.validPhone = ''; }
    },
    this.delay),
    'register.passward1': _.debounce(function(){
      var regex = /^.{6,}$/
      if( !this.register.passward1.match(regex) && this.register.passward1){
        this.warnReg.validPassword = 'Password length must be at least 6 characters.';
      } else { this.warnReg.validPassword = '';}
    },
    this.delay),
    'register.password2': _.debounce(function(){
      var match = (this.register.passward1 === this.register.password2);
      if (match) this.warnReg.matchPassword = '';
      else this.warnReg.matchPassword = 'Password confirmation does not match.';
    },
    this.delay),
  },
  computed: {
    warnRegClean: function(){
      var allwarn = this.warnReg.validUsername + this.warnReg.validPhone + this.warnReg.validPassword + this.warnReg.matchPassword;
      if (allwarn.length === 0) { return true; }
      else return false;
    }
  },
  methods: {
    validateBeforeRegister(){
      this.$validator.validateAll().then((result) => {
        if (result && this.warnRegClean){
          
          console.log('Submitting registeration...');
          
          var payload = this.register;
          addNewUser(payload.username, payload.phone, payload.email, payload.passward1);
          
          var uid = getUserID();
          if (uid){

            this.$router.push({name: 'account'});
          }
        }
        else {  
          alert('Please correct all errors and try again.');
        }
      });
    },

    loginAuthentacation(){
      
      signInWithUsername(this.login.username, this.login.password);
      
      var uid = getUserID();
      if (uid){

        this.$router.push({name: 'account'});
      }
    },
    
    addNewUser(){
      addNewUser("mekmekja", "01 2345 6789", "mekmekja@jongja.com", "mekmekja", function(result) {
          console.log(result);
      });
    },
    signIn(){
      signIn("ch@nch.ai", "ch@nch.ai", false, function(result) {
          console.log(result);
      });
      // signIn("test@jongja.com", "testjongja", false, function(result) {
      //     console.log(result);
      // });
    },
    signInWithUsername(){
      signInWithUsername("chanchai", "ch@nch.ai", function(result) {
          console.log(result);
      });
      // signInWithUsername("mekmekja", "mekmekja", function(result) {
      //     console.log(result);
      // });
    },
    signOut(){
      signOut("trash", function(result) {
          console.log(result);
      });
    },
    getUserID(){
      var uid = getUserID();
      console.log(uid);
    },
    getUserInfo(){
      getUserInfo("trash", function(result) {
          console.log(result);
      });
    },
    getUserReservation(){
      getUserReservation("trash", function(result) {
          console.log(result);
      });
    },
    getUserHistory(){
      getUserHistory("trash", function(result) {
          console.log(result);
      });
    },
    getShopInfo(){
      getShopInfo("MekMek", function(result) {
          console.log(result);
      });
    },
    getShopQueues(){
      getShopQueues("MekMek", function(result) {
          console.log(result);
      });
    },
    addQueue(){
      addQueue("MekMek", function(result) {
          console.log(result);
      });
    },
    updateQueue(){
      updateQueue("1511971409","accept", function(result) {
          console.log(result);
      });
    },
    updateProfile(){
      updateProfile("mekmekja", "mekmekja@jongja.com", "mekmekja", "Mekmek", "JongJa", "01 2345 6789", true, function(result) {
          console.log(result);
      });
    },
    updateShopInfo(){
      updateShopInfo("-L-10WCvFxAdpCl0D5OJ", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true}, function(result) {
          console.log(result);
      });
    },
    addNewShop(){
      addNewShop("MekMek", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true}, function(result) {
          console.log(result);
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
    }
  },
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
  width: fit-content;
  margin: auto;
  align-items: center;
  justify-content: center;
  .header{
    margin-top: auto;
    font-size: 3.45em;
    color: $color-blue;
  }
  .subheader{
    font-size: 1.75em;
    line-height: 1em;
  }
  .button-group{
    display: grid;
    margin: 2em;
    width: 100%;
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
    }
    &.invalid{
      box-shadow: 0 2px $color-orange;
      & + label{
        color: $color-orange;
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

