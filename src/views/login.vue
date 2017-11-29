<template>
  <div class="login-dialog">
    <div class="header">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <transition name="fade" mode="out-in">
      <div v-if="register" class="registerDialog" key="reg">
        <h2>Create new account</h2>
        <div class="form">
          <div class="bundle">
            <input required type="text" id="u-name" value="" />
            <label for="u-name">Username</label>
          </div>
          <div class="bundle">
            <input required type="text" id="u-phone" value="" />
            <label for="u-phone">Phone No.</label>
          </div>
          <div class="bundle">
            <input required type="text" id="u-pass" value="" />
            <label for="u-pass">Password</label>
          </div>
          <div class="bundle">
            <input required type="text" id="u-passconfirm" value=""/>
            <label for="u-passconfirm">Confirm Password</label>
          </div>
          <a class="button green">Register</a>
        </div>
      </div>
      <div v-if="login" class="loginDialog"  key="log">
        <div class="form">
          <div class="bundle">
            <input required type="text" id="u-name" value="" />
            <label for="u-name">Username</label>
          </div>
          <div class="bundle">
            <input required type="text" id="u-pass" value="" />
            <label for="u-pass">Password</label>
          </div>
          <a class="button blue" @click="addNewUser">Login</a>
        </div>
      </div>
      </transition>
      <a @click="registerDialog" class="button green" v-if="!register && !login">Register</a>
      <a @click="registerDialog" class="button transparent green" v-if="!register && login">or Register new account</a>
      <a @click="loginDialog" class="button blue" v-if="!register && !login">Login</a>
      <a @click="loginDialog" class="button transparent blue" v-if="register && !login">or Login with your account</a>
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

export default {
  name: 'login',
  methods: {
    addNewUser(){
      addNewUser("mekmekja", "01 2345 6789", "mekmekja@jongja.com", "mekmekja");
    },
    signIn(){
      signIn("test@jongja.com", "testjongja", false);
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
      updateProfile("mekmekja", "mekmekja@jongja.com", "mekmekja", "Mekmek", "JongJa", "01 2345 6789", true);
    },
    updateShopInfo(){
      updateShopInfo("-L-10WCvFxAdpCl0D5OJ", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    },
    addNewShop(){
      addNewShop("MekMek", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    },
    registerDialog(){
      this.register = true;
      this.login = false;
    },
    loginDialog(){
      this.login = true;
      this.register = false;
    },
  },
  data(){
    return{
      register: false,
      login:false,
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
    label{
      display: block;
      position: absolute;
      color: $color-grey;
      transition: all .15s;
      top: 0em;
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

