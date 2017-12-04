<template>
  <div>
    <div class="nav blue">
        <router-link :to="{name:'account'}" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
        </router-link>
        <!-- <vButton :link="'/shop1'" class="mini transparent button right">Switch to Shop</vButton> -->
    </div>
    <!-- <Navbar :hasBack='true' :link="'/account'"></Navbar> -->
    <keep-alive>
      <AccountPanel :data="user">
        <h3>Settings</h3>
      </AccountPanel>
    </keep-alive>
    <div class="column group">
      <div class="distributed">Push Notification
        <a class="right fa fa-check-square-o link" :class="[notification? '':'grey']" @click="toggleNotification"></a>
      </div>
      <div class="distributed">
        <h4 class="left" v-if="isEdit">Editing Infomation</h4>
        <h4 class="left" v-else>Your Infomation</h4>
        <a class="red link" @click="toggleInfoEdit" v-if="isEdit">Cancel</a>
        <a class="blue link" @click="toggleInfoEdit" v-else>Edit</a>
      </div>
      <div class="acc-edit" v-if="isEdit">
        <label for="phone">Phone Number</label>
        <input v-model="editData.phone" type="text" name="phone" id="phone" value="08x xxx xxxx">
        
        <label for="email">Email</label>
        <input v-model="editData.email" type="text" name="email" id="email">
        
        <label for="password">Password (minimum of 6)</label>
        <input v-model="editData.password" v-validate="'min:6'" data-vv-delay="1000"
          :class="{'invalid' : editData.password != '' && !fields.password.pending &&
              ((fields.password.invalid && (fields.password.dirty||fields.password.touched)))}"
          type="password" name="password" id="password" placeholder="(Unchanged)">
        
        <label for="displayName">Reservation Name</label>
        <input v-model="editData.displayName" type="text" name="displayName" id="displayName">
      </div>
      <a @click="validateThenUpdate" class="blue button transparent link" v-if="isEdit">Save Changes</a>
      <div class="accinfo"  v-if="!isEdit">
        <span>Phone Number</span><span>{{userdata.phone_number}}</span>
        <span>Email</span><span>{{user.email}}</span>
        <span>Password</span><span>••••••••</span>
      </div>
    </div>
    <div class="section">
      <vButton :link="{name: 'setupshop'}" class="orange transparent button">
        <div class="fa fa-shopping-bag"></div>
      Setup a Shop</vButton>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import vee from 'vee-validate'
import VeeConfig from '@/scripts/vee_config.js'
import {_updateProfile} from '@/scripts/api.js';
import {db, auth} from "@/scripts/firebase_config.js"
import Navbar from '@/components/navigationbar.vue'
import AccountPanel from "@/components/accountPanel.vue"
import vButton from "@/components/button.vue"

Vue.use(vee,VeeConfig)

export default {
  components:{
    Navbar,
    AccountPanel,
    vButton,
  },
  computed:{
      user: function(){
          return this.$store.getters.HasAuth
      },
      userdata: function () {
          return this.$store.getters.UserData;
      }
  },
  data(){
    return{
      notification: false,
      isEdit: false,
      commitSave: true,
      editData:{
        phone: '',
        email: '',
        password: '',
        displayName: '',
      }
    }
  },
  methods:{
    toggleNotification: function (){
      let self = this;
      var setNotificationTo = !self.notification;
      var ref = db.ref('users');
      ref.child(self.user.uid).update({"push_notification": setNotificationTo})
        .then(() => {
          console.log('Notification is ' + (setNotificationTo ? 'On' : 'Off'));
          self.notification = setNotificationTo;
        })
        .catch(err => "Fail to switch notification\n" + err.code);
    },
    toggleInfoEdit: function(){
      if (!this.isEdit) { 
        this.editData.phone = this.userdata.phone_number;
        this.editData.email = this.user.email;
        this.editData.displayName = this.user.displayName;
        this.commitSave = false; 
      }
      else if (this.isEdit) { 
        this.commitSave = true;
      }
      this.isEdit = !this.isEdit
    },
    resetForm: function(){
      this.editData.phone = "";
      this.editData.email = "";
      this.editData.password = "";
      this.editData.displayName = "";
    },
    _getUserInfo: function(){
      var self = this;
      var ref = db.ref("users/" + self.$store.getters.HasAuth.uid);
      
      ref.once("value", function(snapshot) {
          self.$store.dispatch('onSyncUserData',snapshot.val());
          self.notification = snapshot.val().push_notification;
      }, function(error) {
          console.log("Error while retrieving User's Info");
          console.log(error.code);
      });
    },
    validateThenUpdate: function(){
      var self = this;
      var formattedPhone = this.editData.phone.replace(/\s/g, '').replace(/^0(\d{2})(\d{3})(\d{4})$/, '0$1 $2 $3');
      this.editData.phone = formattedPhone;
      this.$validator.validateAll().then((result) => {
        if (result){
          console.log('Updating profile...');
          console.log(self.editData);
          self._updateProfile(self.editData);
        }
        else {
          alert('Please correct all errors and try again.');
        }
      });
    },
    _updateProfile: function(data){
        let self = this;
        var ref = db.ref("users");
        
        ref.child(self.user.uid).update({
            "email": data.email,
            "phone_number": data.phone,
            "display_name": data.displayName,
            })
        .then(() => { 

            console.log('Email and Phone number updated');
            self._getUserInfo();

        })
        .catch((err) => { console.log('Fail to update Email and Phone number\n' + err); });
        
        auth.currentUser.updateProfile({
            displayName: data.displayName,
            })
        .then(()=>{

          self.$store.dispatch('onFetchUser');
          console.log('Display name updated'); 
          if (data.password === ""){
            self.commitSave = true;
            self.isEdit = false;
            self.resetForm();

          } })
        .catch(err => { console.log('Fail to update Display name\n' + err); });
        
        if(data.password != ""){
            auth.currentUser.updatePassword(data.password)
              .then(()=>{ 
                console.log('Password Updated'); 
                self.commitSave = true;
                self.isEdit = false;
                self.resetForm();
                })
              .catch(err => { alert('Fail to update Password\n' + err.code);})
        }
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
  },
  // created() {
  //   this._getUserInfo();
  // },
  updated() {
    this._getUserInfo();
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
.acc-edit{
  margin-bottom: 1em;
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
    box-shadow: 0 -2px 0 $color-blue inset;
    outline: none;
  }
  &.invalid{
    box-shadow: 0 -2px 0 $color-red inset;
  }
}
.red {
  color: $color-red;
}
.grey{
  color: $color-grey50;
  &::before{
    content: "\f096";
    margin-right: .125em;
  }
}
</style>
