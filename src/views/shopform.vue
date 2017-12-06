<template>
  <div>
    <div v-if="routeType==='setupshop'" class="nav blue">
        <router-link :to="{name:'settings'}" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>DISCARD
        </router-link>
    </div>
    <div v-if="routeType==='editshop'" class="nav orange">
        <a @click="discardAndReturn" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>DISCARD CHANGES
        </a>
    </div>
    <div class="cover">{{routeType==='editshop' ? 'Change Brand Image':''}}{{routeType==='setupshop' ? 'Choose Brand Image':''}}</div>
    <div class="s-detail">
      <h2 v-if="routeType==='setupshop'">Setup Shop</h2>
      <h2 v-if="routeType==='editshop'">Edit Shop - {{shopForm.name}}</h2>
      <div class="shopform">
        <!--  -->
        <div class="fa fa-id-card-o" v-if="routeType==='setupshop'"></div>
        <div class="form group" v-if="routeType==='setupshop'">
          <input v-model="shopForm.shop_id" v-validate="'required|alpha_num'" data-vv-delay="500"
            :class="{'invalid' : !fields.shopURL.pending && ((fields.shopURL.invalid && (fields.shopURL.dirty||fields.shopURL.touched)) || warnURL.length > 1)}"
            required type="text" name="shopURL" id="s-id" class="lite" />
          <label for="s-id">Shop URL {{shopForm.shop_id ? '- jongja.com/' + shopForm.shop_id : ''}}</label>
          <span v-show="!fields.shopURL.pending && (errors.has('shopURL') || warnURL.length > 1)" class="notifier">
            {{errors.first('shopURL') || warnURL}}
          </span>
        </div>
        <!--  -->
        <div class="fa fa-pencil "></div>
        <div class="form group">
          <input v-model="shopForm.name" v-validate="'required'"
            :class="{'invalid' : !fields.shopName.pending && (fields.shopName.invalid && (fields.shopName.dirty||fields.shopName.touched))}"
            required type="text" name="shopName" id="s-name" class="lite" />
          <label for="s-name">Shop Name</label>
          <span v-show="!fields.shopName.pending && errors.has('shopName')" class="notifier">
            {{errors.first('shopName')}}
          </span>
        </div>
        <!--  -->
        <div class="fa fa-pencil-square-o"></div>
        <div class="form group">
          <textarea v-model="shopForm.desc" v-validate="'required'"
            :class="{'invalid' : !fields.shopDesc.pending && (fields.shopDesc.invalid && (fields.shopDesc.dirty||fields.shopDesc.touched))}"
            required type="text" name="shopDesc" id="s-desc" class="lite"></textarea>
          <label for="s-desc">Shop Description</label>
          <span v-show="!fields.shopDesc.pending && errors.has('shopDesc')" class="notifier">
            {{errors.first('shopDesc')}}
          </span>
        </div>
        <!--  -->
        <div class="fa fa-phone"></div>
        <div class="form group">
          <input v-model="shopForm.phone" :class="{'invalid' : warnPhone.length > 1}"
            type="text" name="PhoneNo" id="s-phone" />
          <label for="s-phone" :class="{'s-phone-value' : shopForm.phone != ''}">Shop Phone No. (optional)</label>
          <span v-show="warnPhone.length > 1" class="notifier">
            {{warnPhone}}
          </span>
        </div>
        <!--  -->
        <div class="fa fa-clock-o"></div>
        <div class="time-group">
          <div class="form group">
            <input v-model="shopForm.open" v-validate="'required'" 
              :class="{'invalid' : !fields.ShopOpen.pending && (fields.ShopOpen.invalid && (fields.ShopOpen.dirty||fields.ShopOpen.touched))}"
              required type="time" name="ShopOpen" id="s-timestart" class="lite s-time" value="09:30" />
            <label for="s-time">Shop Queue Open</label>
            <span v-show="!fields.ShopOpen.pending && errors.has('ShopOpen')" class="notifier">
              {{errors.first('ShopOpen')}}
            </span>
          </div>
          <!--  -->
          <div class="form group">
            <input v-model="shopForm.close" v-validate="'required'"
              :class="{'invalid' : !fields.ShopClose.pending && (fields.ShopClose.invalid && (fields.ShopClose.dirty||fields.ShopClose.touched))}"
              required type="time" name="ShopClose" id="s-timeend" class="lite s-time" value="19:30" />
            <label for="s-time">Shop Queue Close</label>
            <span v-show="!fields.ShopClose.pending && errors.has('ShopClose')" class="notifier">
              {{errors.first('ShopClose')}}
            </span>
          </div>
        </div>
        <!--  -->
        <div class="form group days">
          <div class="day-group">
            <input v-model="shopForm.serviceday.sun" required type="checkbox" id="s-sunday" class="lite" value="" /><label for="s-sunday">Sun</label>
            <input v-model="shopForm.serviceday.mon" required type="checkbox" id="s-monday" class="lite" value="" /><label for="s-monday">Mon</label>
            <input v-model="shopForm.serviceday.tue" required type="checkbox" id="s-tuesday" class="lite" value="" /><label for="s-tuesday">Tue</label>
            <input v-model="shopForm.serviceday.wed" required type="checkbox" id="s-wednesday" class="lite" value="" /><label for="s-wednesday">Wed</label>
            <input v-model="shopForm.serviceday.thu" required type="checkbox" id="s-thursday" class="lite" value="" /><label for="s-thursday">Thu</label>
            <input v-model="shopForm.serviceday.fri" required type="checkbox" id="s-friday" class="lite" value="" /><label for="s-friday">Fri</label>
            <input v-model="shopForm.serviceday.sat" required type="checkbox" id="s-saturday" class="lite" value="" /><label for="s-saturday">Sat</label>
          </div>
          <div class="s-day">Shop Service Days {{shopDayNotion}}</div>
        </div>
      </div>
      <div class="column group">
        <a @click="validateThenCommit" v-if="routeType==='setupshop'" class="wide orange button">Create Shop</a>
        <a @click="validateThenCommit" v-if="routeType==='editshop'" class="wide orange button">Confirm Changes</a>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import vee from 'vee-validate'
import VeeConfig from '@/scripts/vee_config.js'
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
import {db,auth,storage} from '@/scripts/firebase_config';

Vue.use(vee,VeeConfig);

export default {
  components: {
    Navbar,
    vButton
  },
  methods: {
    discardAndReturn: function(){
      this.$router.go(-1);
    },
    populateForm: function(){
      if (this.routeType === 'editshop') {
        var service_days = this.shopdata.service_days;
        this.shopForm.shop_id = this.$route.params.id;
        this.shopForm.name = this.shopdata.name;
        this.shopForm.desc = this.shopdata.description;
        this.shopForm.phone = this.shopdata.phone_number;
        this.shopForm.open = this.shopdata.open_time;
        this.shopForm.close = this.shopdata.close_time;
        this.shopForm.serviceday.sun = (service_days.sun ? service_days.sun: false);
        this.shopForm.serviceday.mon = (service_days.mon ? service_days.mon: false);
        this.shopForm.serviceday.tue = (service_days.tue ? service_days.tue: false);
        this.shopForm.serviceday.wed = (service_days.wed ? service_days.wed: false);
        this.shopForm.serviceday.thu = (service_days.thu ? service_days.thu: false);
        this.shopForm.serviceday.fri = (service_days.fri ? service_days.fri: false);
        this.shopForm.serviceday.sat = (service_days.sat ? service_days.sat: false);
      }
    },
    validateThenCommit: function(){
      var self = this;
      var formattedPhone = self.shopForm.phone.replace(/\s/g, '').replace(/^0(\d{2})(\d{3})(\d{4})$/, '0$1 $2 $3');
      var openDaily = {
        sun: true,
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
      }
      var service_days = self.shopOpenDaily ? openDaily : self.shopForm.serviceday;
      self.$validator.validateAll().then((result) => {
        let self = this;
        if(result && self.warnClear) {
          if (self.routeType === 'setupshop'){
            
            var ref = db.ref('shops');
            var userShopListRef = db.ref('users/' + self.user.uid + '/shop_list');
            ref.child(self.shopForm.shop_id).set({
              "name": self.shopForm.name,
              "description": self.shopForm.desc,
              "owner": self.user.uid,
              "phone_number": formattedPhone,
              "open_time": self.shopForm.open,
              "close_time":  self.shopForm.close,
              "service_days":  service_days,
            }).then(() => {
              console.log("Add New Shop Complete");

              self.commitSave = true;
              userShopListRef.child(self.shopForm.shop_id).set(self.shopForm.shop_id)
              .then(() => {

                self.commitSave = true;
                console.log("Update shop list complete");
                self.$router.push({name: 'shop', params: {id: self.shopForm.shop_id}})
              
              }).catch(err => {
                alert("Error while update your shop list\n" + err.code);
              });
              
            }).catch(err => {
              alert("Error while Adding New Shop\n" + err.code);
            });
          }
          else if (self.routeType === 'editshop'){
            var ref = db.ref('shops');
            ref.child(self.shopForm.shop_id).update({
              "name": self.shopForm.name,
              "description": self.shopForm.desc,
              "owner": self.user.uid,
              "phone_number": formattedPhone,
              "open_time": self.shopForm.open,
              "close_time":  self.shopForm.close,
              "service_days":  service_days,
              "last_queue": 1
            }).then(() => {
              console.log("Update Shop's Info Complete");
              self.commitSave = true;
              self.$router.push({name: 'shop', params: {id: self.shopForm.shop_id}})
            }).catch(err => {
              console.log("Error while Updating Shop's Info\n" + err.code);
            });
          }
        }
        else {
          console.log('Please correct all errors and try again.');
        }
      }); 
      //self.commitSave = true;
    },
    _FetchShopData: function(){
      let self = this;

      self.$store.dispatch('onLoadingAsync',true);
      
      var shopID = self.$route.params.id;
      var ref = db.ref('shops/' + shopID);
      ref.once('value', function(snap){
        // console.log(snap.key)
        var shopData = Object.assign({key: snap.key}, snap.val());
        self.$store.dispatch('onLoadingAsync',false);
        if (snap.val()) {
          if (shopData.owner != self.$store.getters.HasAuth.uid){
            alert('Unauthorized access to ' + shopData.name + '. Returning to previous page.');
            self.$router.go(-1);
            return;
          }
        }
        self.$store.dispatch('onFetchCurrentShopData', shopData);
      
      }), function(err) {
      
        self.$store.dispatch('onLoadingAsync',false);
        console.log('Error retrieving Shop Info\n' + err.code);

      }
    }
  },
  watch:{
    shopdata : 'populateForm',

    'shopForm.shop_id': _.debounce(function(){
      let self = this;
      if (self.routeType === 'setupshop'){
        var ref = db.ref('shops/' + this.shopForm.shop_id);
        ref.once('value', function(snap) {
          if (snap.val() && self.shopForm.shop_id){
            self.warnURL = 'This URL is already taken.';
          }
          else self.warnURL = '';
        }, function(err) { self.warnURL = ''; })
      }
    }, 500),

    'shopForm.phone': function(){
      var regex = /^0(\d\s*){9}$/
      if(!this.shopForm.phone.match(regex) && this.shopForm.phone){
        this.warnPhone = 'Phone number must be "0XX XXX XXXX"';
      }else{
        this.warnPhone = '';
      }
    }
  },
  computed:{
    routeType: function() {
      return this.$route.name;
    },
    user: function(){
      return this.$store.getters.HasAuth;
    },
    shopDayValue: function(){
      var day = this.shopForm.serviceday;
      return (day.sun?64:0) + (day.mon?32:0) + (day.tue?16:0) + (day.wed?8:0) + (day.thu?4:0) + (day.fri?2:0) + (day.sat?1:0);
    },
    shopOpenDaily: function(){
      return (this.shopDayValue%(64+32+16+8+4+2+1) === 0);
    },
    shopDayNotion: function(){
      var notion = ' : ';
      if (this.shopOpenDaily){
        return notion + 'Opens daily';
      }
      else if (this.shopDayValue === 32+16+8+4+2) {
        return notion + 'Opens weekday'
      }
      else if (this.shopDayValue === 64+1) {
        return notion + 'Opens weekend'
      }
    },
    shopdata: function(){
      return this.$store.getters.CurrentShopData;
    },
    warnClear: function(){
      return this.warnURL + this.warnPhone === '';
    }
  },
  beforeRouteLeave (to, from, next){
    if (this.commitSave) { next(); }
    else {
      var msg = ''
      if (this.routeType === 'setupshop') msg = 'Abort shop setup and return to your account?';
      else if (this.routeType === 'editshop') msg = 'Discard changes and return to shop page?';
      else msg = 'Error occurred, please start over again.'
      var confirm = window.confirm(msg);
      if (confirm){
        next();
      } else {
        next(false);
      }
    }
  },
  data() {
    return{
      commitSave: false,
      shopForm: {
        shop_id: '',
        name: '',
        desc: '',
        phone: '',
        // capacity: '',
        open: '08:00',
        close: '16:00',
        serviceday: {
          sun: false,
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
        },
      },
      warnURL: '',
      warnPhone: '',
    }
  },
  created(){
    if (this.routeType==='editshop') {
      this._FetchShopData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.nav{
  left: 0;
}
.cover{
  width: 100%;
  min-height: 200px;
  background-color: $color-orange85;
  cursor: pointer;
  transition: opacity .3s;
  color: white;
  line-height: 200px;
  opacity:0.5;
  &:hover{
    opacity: $opacity-link !important;
  }
}
.time-group{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  input {
    width: 100% !important;
  }
}
.day-group{
  display: flex;
}
.s-detail{
  width: -webkit-fill-available;
  max-width: 500px;
  padding: 0 1em;
  padding-bottom: 1em;
}
.s-phone-value{
  font-size: .8em;
  top: -1.25em;
  color: $color-orange;
}
.shopform{
    display: grid;
    grid-template-columns: 1em auto;
    grid-template-areas: "glyph form";
    grid-template-rows: auto;
    align-items: center;
    grid-gap: .25rem;
    width: inherit;
    .fa-pencil-square-o{
      line-height: 3.5em;
      align-self: baseline;
    }
    .wide.button{
        grid-column: 2 span;
    }
    .days{
      grid-column: span 2;
    }
    .notifier{
      display: block;
      position: absolute;
      font-size: .8em;
      color: $color-red;
      transition: all .15s;
      top: 2.25em;
      text-align: center;
    }
}
.invalid{
  box-shadow: 0 2px $color-red !important;
  & + label{
    color: $color-red !important;
  }
}
label.readonly{
  // font-size: .8em;
  // top: -1.25em;
  color: $color-orange;
}
input.readonly{
  visibility: hidden;
}
.group.form{
    display: grid;
    grid-template-columns: 1fr max-content;
    position: relative;
    text-align: left;
    width: inherit;
}

textarea{
  border: none;
  box-shadow: 0 1px $color-grey50;
  resize: vertical;
  width: 100%;
  font-family: 'Kanit', sans-serif;
  font-weight: $font-normal;
  font-size: 1em;
  transition: all .15s;
  outline: none;
  min-height: 7.5em;
  &:focus{
    box-shadow: 0 2px $color-orange50;
  }
  &:focus + label, &:valid + label{
      font-size: .8em;
      top: -1.25em;
      color: $color-orange;
  }
}
input.lite{
  width: -webkit-fill-available;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 1px $color-grey50;
  outline: none;
  color: $color-grey;
  font-family: 'Kanit', sans-serif;
  font-weight: $font-normal;
  font-size: 1em;
  transition: all .15s;
  &:focus, &:valid{
    box-shadow: 0 2px $color-orange50;
  }
  &:focus + label, &:valid + label{
    font-size: .8em;
    top: -1.25em;
    color: $color-orange;
  }
}
input#s-phone{
  width: -webkit-fill-available;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 1px $color-grey50;
  outline: none;
  color: $color-grey;
  font-family: 'Kanit', sans-serif;
  font-weight: $font-normal;
  font-size: 1em;
  transition: all .15s;
  &:focus{
    box-shadow: 0 2px $color-orange50;
  }
  &:focus + label{
    font-size: .8em;
    top: -1.25em;
    color: $color-orange;
  }
}

input[type=checkbox].lite {
  display: none !important;
  & + label{
    border-radius: 5px;
    border: 1px solid $color-orange;
    color: $color-orange;
    display: inline-block;
    line-height: 3rem;
    text-align: center;
    width: 2.125rem;
    position: unset;
    margin: .75rem .125rem;
  }
  &:focus + label, &:valid + label{
    font-size: 1.1em;
    top: unset;
    color: white;
    background-color: $color-orange;
    border-color: transparent;
  }
}

input.s-time{
    font-size: 1.6em;
    & + label{
      font-size: .8em;
      top: -1.25em;
      color: $color-orange;
    }
    & + label + span{
      top: 3.25em !important;
    }
}

.s-day{
    display: block;
    position: absolute;
    color: $color-orange;
    font-size: .8em;
    top: -1.25em;
}

label{
    display: block;
    position: absolute;
    color: $color-grey;
    transition: all .15s;
    top: 0em;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    width: inherit;
}
</style>
