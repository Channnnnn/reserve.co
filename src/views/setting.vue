<template>
  <div>
    <div class="nav blue">
        <router-link :to="'/account'" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
        </router-link>
        <!-- <vButton :link="'/shop1'" class="mini transparent button right">Switch to Shop</vButton> -->
    </div>
    <!-- <Navbar :hasBack='true' :link="'/account'"></Navbar> -->
    <AccountPanel>
      <h3>Settings</h3>
    </AccountPanel>
    <div class="column group">
      <div class="distributed">Push Notification
        <a class="right fa fa-check-square-o link" :class="[notification? '':'grey']" @click="toggleNotification"></a>
      </div>
      <div class="distributed">
        <h4 class="left" v-if="isEdit">Editing Infomation</h4>
        <h4 class="left" v-else>Your Infomation</h4>
        <a class="blue link" @click="toggleInfoEdit" v-if="isEdit">Confirm</a>
        <a class="blue link" @click="toggleInfoEdit" v-else>Edit</a>
      </div>
      <div class="acc-edit" v-if="isEdit">
        <label for="phone">Phone Number</label><input type="text" name="phone" id="phone" value="08x xxx xxxx">
        <label for="email">Email</label><input type="text" name="email" id="email" value="we@ggmail.com">
        <label for="password">Password</label><input type="password" name="password" id="password" value="••••••••">
      </div>
      <div class="accinfo" v-else>
        <span>Phone Number</span><span>08x xxx xxxx</span>
        <span>Email</span><span>we@ggmail.com</span>
        <span>Password</span><span>••••••••</span>
      </div>
    </div>
    <div class="section">
      <vButton :link="'/setupshop'" class="orange transparent button">
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
      notification: false,
      isEdit: false,
      commitSave: true,
    }
  },
  methods:{
    toggleNotification: function (){
      this.notification = !this.notification
    },
    toggleInfoEdit: function(){
      if (!this.isEdit) { this.commitSave = false; }
      else if (this.isEdit) { this.commitSave = true; }
      this.isEdit = !this.isEdit
    }
  },
  beforeRouteLeave(to, from, next){
    if (this.commitSave) { next(); }
    else {
      var confirm = window.confirm('Discard changes and return to account page?');
      if (confirm){
        next();
      } else {
        next(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";

.column.group{
    padding: 0 1em;
    width: -webkit-fill-available;
    max-width: 400px;
}
.distributed{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.accinfo, .acc-edit{
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: left;
    line-height: 2em;
}

input{
  min-width: 150px;
  font-family: 'Kanit','Arial', sans-serif;
  font-size: 1em;
  font-weight: 300;
  padding: 0;
  border: 0;
  padding-bottom: 0.25em;
  margin-top: 0.25em; 
  color: $color-grey;
  box-shadow: 0 -1px 0 $color-grey50 inset;
  &:focus{
    box-shadow: 0 -2px 0 $color-red inset;
    outline: none;
  }
}

.grey{
  color: $color-grey50;
  &::before{
    content: "\f096";
    margin-right: .125em;
  }
}
</style>
