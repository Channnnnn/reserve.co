<template>
  <div class="login-dialog">
    <div class="header">RESERVE.CO</div>
    <div class="subheader">จองคิวง่ายๆ แค่ไม่กี่คลิก</div>
    <div class="button-group">
      <a href="#" class="button transparent">Register</a>
      <a href="#" class="button">Login</a>
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
export default {
  name: 'login'
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

