<template>
  <div>
    <Navbar :hasBack='true' :link="'/account'"></Navbar>
    <AccountPanel>
      <h3>Settings</h3>
    </AccountPanel>
    <div class="column group">
      <div class="distributed">Push Notification
        <a class="right fa fa-check-square-o link" :class="[notification? '':'grey']" @click="toggleNotification"></a>
      </div>
      <div class="distributed">
        <h4 class="left">Your Infomation</h4>
        <a href="#" class="blue link">Edit</a>
      </div>
      <div class="accinfo">
        <span>Phone Number</span><span>08x xxx xxxx</span>
        <span>Email</span><span>we@ggmail.com</span>
        <span>Password</span><span>••••••••</span>
      </div>
    </div>
    <div class="section">
      <vButton class="red transparent button" href="#">
        <div class="fa fa-shopping-bag"></div>
      Setup a Shop</vButton>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
import AccountPanel from "@/components/accountPanel.vue"
import vButton from "@/components/button.vue"
export default {
  components:{
    Navbar,
    AccountPanel,
    vButton,
  },
  data(){
    return{
      notification: false
    }
  },
  methods:{
    toggleNotification: function (){
      this.notification = !this.notification
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.distributed{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.accinfo{
    min-width: 320px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: left;
}

.grey{
  color: $color-grey50;
  &::before{
    content: "\f096";
    margin-right: .125em;
  }
}
</style>
