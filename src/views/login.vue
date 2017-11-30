<template>
  <div class="login-dialog">
    <div class="header">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <transition-group name="fade" mode="out-in">
      <div v-if="isRegister" class="registerDialog" key="reg">
        <h2>Create new account</h2>
        <div class="form">
          <div class="bundle">
            <input v-model.lazy="register.username" v-validate="'required|alpha_num'" 
            :class="{'invalid' : (fields.username.invalid && fields.username.touched) || this.warnReg.validUsername.length > 1}" type="text" name="username" ref="username" required />
            
            <label for="username">Username</label>
            <span v-show="(errors.has('username') || this.warnReg.validUsername.length > 1)" class="notifier">{{errors.first('username') || this.warnReg.validUsername}}</span>
          </div>
          <div class="bundle">
            <input v-model.lazy="register.email" v-validate="'required|email'" 
            :class="{'invalid' : fields.email.invalid && fields.email.touched}" type="text" name="email" ref="email" required />
            
            <label for="email">Email</label>
            <span v-show="errors.has('email')" class="notifier">{{errors.first('email')}}</span>
          </div>
          <div class="bundle">
            <input v-model.lazy="register.phone" v-validate="'required'" 
            :class="{'invalid' : (fields.phone.invalid && fields.phone.touched) || this.warnReg.validPhone.length > 1}" type="text" name="phone" ref="phone" required />
            
            <label for="phone">Phone No.</label>
            <span v-show="errors.has('phone') || this.warnReg.validPhone.length > 1" class="notifier">{{errors.first('phone') || this.warnReg.validPhone}}</span>
          </div>
          <div class="bundle">
            <input v-model.lazy="register.passward1" v-validate="'required'"
            :class="{'invalid' : (fields.Password.invalid && fields.Password.touched) || this.warnReg.validPassword.length > 1}" type="password" name="Password" ref="Password" required />
            <label for="Password">Password</label>
            <span v-show="errors.has('Password') || this.warnReg.validPassword.length > 1" class="notifier">{{errors.first('Password') || this.warnReg.validPassword}}</span>
          </div>
          <div class="bundle">
            <input v-model.lazy="register.password2" v-validate="'required'"
            :class="{'invalid' : (fields.password.invalid && fields.password.touched) || this.warnReg.matchPassword.length > 1}" type="password" name="password" ref="password" required />
            <label for="password">Confirm Password</label>
            <span v-show="errors.has('password') || this.warnReg.matchPassword.length > 1" class="notifier">{{errors.first('password') || this.warnReg.matchPassword}}</span>
          </div>
          <a @click="validateRegister" class="button green">Register</a>
        </div>
      </div>
      <div v-if="isLogin" class="loginDialog" key="log">
        <div class="form">
          <div class="bundle">
            <input required v-model="login.username" type="text" id="u-name" value="" />
            <label for="u-name">Username</label>
          </div>
          <div class="bundle">
            <input required v-model="login.password" type="text" id="u-pass" value="" />
            <label for="u-pass">Password</label>
          </div>
          <a class="button blue">Login</a>
        </div>
      </div>
      </transition-group>
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
import Vue from 'vue'
import vee from 'vee-validate'
import {
            addNewUser,
            signIn,
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
            addNewShop
} from "@/scripts/api.js"

const config = {
    errorBagName: 'errors', // change if property conflicts
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
      warnReg:{
        validUsername: '',
        validPhone: '',
        validPassword: '',
        matchPassword: '',
      }
    }
  },
  watch: {
    'register.username': function(){
      var regex = /^[a-zA-Z0-9]{4,25}$/
      if(!this.register.username.match(regex)){
        this.warnReg.validUsername = 'Password length must be 4-25 characters.';
      } else { this.warnReg.validUsername = '';}
    },
    'register.phone': function(){
      if (this.register.phone === '') {
        this.warnReg.validPhone = 'Phone number required';
        return;
      }
      var regex = /^(0[0-9]{9})$/
      if (!this.register.phone.match(regex) && this.register.phone){
        this.warnReg.validPhone = 'Phone number must be 10-digits format.';
      } else { this.warnReg.validPhone = ''; }
    },
    'register.passward1': function(){
      var regex = /^[a-zA-Z0-9_]{6,25}$/
      if( !this.register.passward1.match(regex) && this.register.passward1){
        this.warnReg.validPassword = 'Password length must be 6-25 characters.';
      } else { this.warnReg.validPassword = '';}
    },
    'register.password2': function(){
      var match = (this.register.passward1 === this.register.password2);
      if (match) this.warnReg.matchPassword = '';
      else this.warnReg.matchPassword = 'Password confirmation does not match.';
    }
  },
  methods: {
    validateRegister(){

    },
    addNewUser(){
      addNewUser("tester@jongja.com", "testerjongja");
    },
    signIn(){
      signIn("test@jongja.com", "testjongja");
    },
    signOut(){
      signOut();
    },
    getUserID(){
      var uid = getUserID();
      console.log(uid);
    },
    getUserInfo(){
      var result = getUserInfo();

      console.log(result.data)
    },
    getUserReservation(){
      var result = getUserReservation();

      console.log(result.data)
    },
    getUserHistory(){
      var result = getUserHistory();

      console.log(result.data)
    },
    getShopInfo(){
      var result = getShopInfo("-L-10WCvFxAdpCl0D5OJ");

      console.log(result.data)
    },
    getShopQueues(){
      var result = getShopQueues("-L-10WCvFxAdpCl0D5OJ");

      console.log(result.data)
    },
    addQueue(){
      addQueue("-L-10WCvFxAdpCl0D5OJ");
    },
    updateQueue(){
      updateQueue("1511962120","accept");
    },
    updateProfile(){
      updateProfile("tester@jongja.com", "testerjongja", "Tester", "JongJa", "01 2345 6789", true);
    },
    updateShopInfo(){
      updateShopInfo("-L-10WCvFxAdpCl0D5OJ", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    },
    addNewShop(){
      addNewShop("Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    },
    registerDialog(){
      this.isRegister = true;
      this.isLogin = false;
    },
    loginDialog(){
      this.isLogin = true;
      this.isRegister = false;
    },
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

