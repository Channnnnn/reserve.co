<template>
  <div class="login-dialog">
    <div class="header">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <a href="#" class="button transparent">Register</a>
      <a href="#" class="button" @click="getUserReservation">Login</a>
      <div class="divider">OR CONNECT WITH</div>
      <div class="button-row">
        <a href="#" class="button facebook">Facebook</a>
        <a href="#" class="button google">Google</a>
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
      addNewUser("tester@jongja.com", "testerjongja");
    },
    signIn(){
      signIn("tester@jongja.com", "testerjongja");
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
      updateQueue("1511811329","accept");
    },
    updateProfile(){
      updateProfile("tester@jongja.com", "testerjongja", "Tester", "JongJa", "01 2345 6789", true);
    },
    updateShopInfo(){
      updateShopInfo("-L-10WCvFxAdpCl0D5OJ", "Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    },
    addNewShop(){
      addNewShop("Tester's Shop", "Tester's Shop Description", {}, "012 345 678", 100, "9:30", "21:30", {"fri": true});
    }
  }
}

</script>

<style lang="scss" scoped>
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
    color: hsl(193, 66%, 45%);
  }
  .subheader{
    font-size: 1.75em;
    line-height: 1em;
  }
  .button-group{
    display: grid;
    margin: 2em;
    width: 100%;
    grid-template-rows: repeat(4,1fr);
    align-items: center;
    grid-gap: 8px;
  }
  .button-row{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
  }
  .divider{
    overflow: hidden;
    text-align: center;
    color: rgb(92, 92, 92);
    font-size: .75em;
    &::before, &::after {
      display: inline-block;
      content: "";
      height: 1px;
      position: relative;
      vertical-align: middle;
      width: 50%;
      background-color: rgba(92, 92, 92,.5);
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
.facebook{
  background-color: hsl(221, 42%, 42%);
}
.google{
  background-color: hsl(5, 70%, 59%);
}
</style>

