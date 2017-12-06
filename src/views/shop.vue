<template>
  <div v-if="shopdata">
    <div v-if="!user" class="ghost nav">
      <a @click='loginThenRedirectHere' class="mini transparent button right">Login</a>
    </div>
    <div v-if="user && shopdata && user.uid != shopdata.owner" class="nav blue"><!-- Show this instead if not owner -->
      <router-link :to="{name : 'account'}" class="menu link">
        <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
      </router-link>
    </div>
    <div v-if="user && shopdata && user.uid === shopdata.owner" class="nav orange"><!-- Show this if shop owner -->
      <a class="menu link" @click="toggleAside">
          <div class="fa fa-bars rightspaced"></div>MY SHOP
      </a>
      <vButton :link="{name : 'account'}" class="mini orange transparent button right">Switch to Account</vButton>
    </div>
    <div class="cover"></div>
    <div class="s-detail" v-if="shopdata.key === $route.params.id">
      <h2>{{shopdata.name}}</h2>
      <div>
        <div class="lite multiline">
          <div class="fa fa-pencil-square-o" aria-hidden="true"></div>{{shopdata.description}}</div>
        <div class="lite">
          <div class="fa fa-clock-o"></div>{{shopdata.open_time}} - {{shopdata.close_time}} · {{shopDayNotion}}
          <div class="right bubble pointleft" :class="[checkAvailableTime ? 'opening':'closing']"></div>
        </div>
        <div class="lite">
          <div class="fa fa-phone"></div>087 654 3210</div>
      </div>
      <div class="column-group">
        
        <a @click="bookReservation" 
          v-if="user && (shopdata.owner != user.uid) && checkAvailableTime && pendingConfirmed && (hasPendingReservation.user_id != user.uid || hasPendingReservation.status != 'waiting')" 
          class="huge wide green button">Book Reservation</a>

        <a v-if="!user" class="huge wide green button">Book Reservation</a>

        <vButton v-if="user && (shopdata.owner != user.uid) && (hasPendingReservation.user_id === user.uid && hasPendingReservation.status === 'waiting')" 
          :link="{name: 'queue', params: {qid: hasPendingReservation.key}}" 
          class="huge wide blue button">View Reservation</vButton>

        <vButton v-if="user && shopdata.owner === user.uid" :link="{name: 'managequeue'}" class="huge wide green button">Manage Reservation</vButton>
        <vButton v-if="user && shopdata.owner === user.uid" :link="{name: 'editshop'}" class="orange transparent button link">Edit Shop Info</vButton>
      </div>
      <div class="rounded row group urlinfo">
        <a @click="copyURL" class="copy button">{{copyButton}}</a>
        <input ref="shopURL" class="shopurl" type="text" :value=shopURL readonly="readonly" />
      </div>
    </div>
    <transition name="slide">
    <div class="aside" v-if="showAside">
      <a class="menu link" @click="toggleAside">
        <div class="fa fa-arrow-left rightspaced"></div>{{shopdata.name}}
      </a>
      <router-link :to="{name: 'editshop'}" class="list link orange">Edit Shop Info</router-link>
      <router-link :to="{name: 'account'}" class="list button blue transparent">Return to Account</router-link>
      <span class="mini divider"></span>
      <div class="list header">Shop list</div>
      <router-link @mousedown.left="closeAside" :to="{name: 'shop', params: {id: shop}}" v-for="shop in userdata.shop_list" :key="shop" class="list orange link">{{shop}}</router-link>
      <Logout></Logout>
    </div>
    </transition>
    <transition name="fade">
      <div v-if="showAside" class="aside-hide" @mousedown.left="closeAside" key="not-aside"></div>
    </transition>
  </div>
  <NotFound v-else-if="shopNotExist"></NotFound>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config';
import NotFound from '@/views/404'
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
import Logout from "@/components/logoutButton.vue"
export default {
  components: {
    Navbar,
    vButton,
    Logout,
    NotFound
  },
  computed:{
    shopURL: function(){
      return window.location.origin + this.$route.path;
    },
    user : function() {
      return this.$store.getters.HasAuth;
    },
    userdata: function(){
      return this.$store.getters.UserData;
    },
    shopdata: function() {
      return this.$store.getters.CurrentShopData;
    },
    shopDayValue: function(){
      if (this.shopdata) {
        var day = this.shopdata.service_days;
        return (day.sun?64:0) + (day.mon?32:0) + (day.tue?16:0) + (day.wed?8:0) + (day.thu?4:0) + (day.fri?2:0) + (day.sat?1:0);
      }
      else {
        return 0;
      }
    },
    shopOpenDaily: function(){
      return (this.shopDayValue%(64+32+16+8+4+2+1) === 0);
    },
    shopDayNotion: function(){
      var day = this.shopdata.service_days;
      var notion = '';
      if (this.shopOpenDaily){
        return 'Opens daily';
      }
      else if (this.shopDayValue === 32+16+8+4+2) {
        return 'Opens weekday'
      }
      else if (this.shopDayValue === 64+1) {
        return 'Opens weekend'
      }
      else {
        if (day.sun) notion += 'Sun ';
        if (day.mon) notion += 'Mon ';
        if (day.tue) notion += 'Tue ';
        if (day.wed) notion += 'Wed ';
        if (day.thu) notion += 'Thu ';
        if (day.fri) notion += 'Fri ';
        if (day.sat) notion += 'Sat ';
        return notion;
      }
    },
    checkAvailableTime: function() {
      var day = this.shopdata.service_days;
      var open_time = this.shopdata.open_time;
      var close_time = this.shopdata.close_time;
      
      var openDays = [(day.sun ? 0 : null),
          (day.mon ? 1 : null),
          (day.tue ? 2 : null),
          (day.wed ? 3 : null),
          (day.thu ? 4 : null),
          (day.fri ? 5 : null),
          (day.sat ? 6 : null),].filter(Number);
      // console.log(openDays);

      var currentDay = new Date().getDay();
      var openToday = openDays.includes(currentDay);

      // Phuwach continues here.

      if (!openToday) { return false; }

      // Direct string comparison.
      var openOverNight = (open_time > close_time ? true : false);

      var current_time = new Date().getHours() + ":" + new Date().getMinutes();
      
      if (openOverNight) {
          if ((current_time < close_time) || (current_time > open_time)) return true;
          else return false;
      } else {
          if ((current_time > open_time) && (current_time < close_time)) return true;
          else return false;
      }
    },
  },
  watch: {
    '$route': function(){
      this._FetchShopData();
      this._LastResevation();
    }
  },
  methods: {
    copyURL: function(){
      this.$refs.shopURL.select();
      document.execCommand('copy',true);
      this.copyButton = 'Copied !'
      setTimeout(() => { this.copyButton = 'Copy URL' }, 1000)
    },
    toggleAside: function() {
      this.showAside = !this.showAside;
    },
    closeAside: function(){
      this.showAside = false;
    },
    loginThenRedirectHere: function(){
      this.$store.dispatch('setRedirect', this.$route.fullPath);
      this.$router.push({name: 'login'});
    },
    bookReservation: function(){
      let self = this;
      var shopID = self.$route.params.id;
      var bookTime = Date.now();

      //Get Lastest queue count
      var shopRef = db.ref('shops/' + shopID);
      shopRef.once('value', function(snap) {
        let shopSnapData = snap.val();
        var lastQueue = { id: '', queue_number: 0};
        if (shopSnapData.last_queue){
          lastQueue = { 
            id: shopSnapData.last_queue.id,
            queue_number: shopSnapData.last_queue.queue_number
          }
        }
        var queueRef = db.ref('queues');

        queueRef.child(bookTime).set({
          queue_number: lastQueue.queue_number + 1,
          shop_id: shopID,
          shop_name: self.shopdata.name,
          shop_description: self.shopdata.description,
          status: 'waiting',
          user_id: self.user.uid,
          user_display_name: self.user.displayName,
          user_phone_number: self.userdata.phone_number
        }).then(() =>{
          //Added queue, last queue Increment

          // shopRef.update({ last_queue: shopSnapData.last_queue + 1 })
          shopRef.child('last_queue').set({
              id: bookTime,
              queue_number: lastQueue.queue_number + 1
            })
            .then(() => {
              console.log('Update shop last queue');
            })
            .catch(err => {
              console.log('Error update shop last queue\n' + err.code);
            });

          console.log('Booked reservation');
          self.$router.push({name: 'queue', params: {qid: bookTime}});

        }).catch(err => {
          //Fail to add queue
          console.log('Error Booking reservation\n' + err.code);
        })
      })
      
    },
    _FetchUserData: function(){
        if (this.user){
            let self = this;
            var ref = db.ref('users/' + self.user.uid);
            ref.on('value', function(snap){
                self.$store.dispatch('onSyncUserData', snap.val());
            }, function(err) { console.log('Error getting user data\n' + err.code); })
        }
    },
    _FetchShopData: function(){
      let self = this;
      if (self.showAside) { self.closeAside(); }
      
      self.$store.dispatch('onLoadingAsync',true);
      
      var shopID = self.$route.params.id;
      var ref = db.ref('shops/' + shopID);
      ref.once('value', function(snap){
        // console.log(snap.key)
        var shopData = null;
        if (snap.val()) {
          self.shopNotExist = false;
          shopData = Object.assign({key: snap.key}, snap.val());
        }
        else { 
          self.shopNotExist = true;
        }
        self.$store.dispatch('onLoadingAsync',false);
        self.$store.dispatch('onFetchCurrentShopData', shopData);
      
      }), function(err) {
      
        self.$store.dispatch('onLoadingAsync',false);
        self.shopNotExist = true;
        console.log('Error retrieving Shop Info\n' + err.code);

      }
    },
    _LastResevation: function(){
      let self = this;
      var query = db.ref('queues')
        .orderByChild('shop_id')
        .equalTo(self.$route.params.id).limitToLast(100);
      query.once('value', function(snapQuery){
        if (snapQuery.val()){
          var results = snapQuery.val();
          var foundPending = {key: '', status: ''};
          for (const r in results){
            if (results[r].user_id === self.user.uid && results[r].status === 'waiting'){
              foundPending = Object.assign({key: r}, results[r]);
            }
          }
          self.hasPendingReservation = foundPending;
          self.pendingConfirmed = true;
        }
        else {
          self.pendingConfirmed = true;
        }
      }, function(err) {
        console.log("Error get last reservation\n" + err.code);
      })
    }
  },
  data() {
    return{
      shopNotExist: false,
      showAside: false,
      copyButton: 'Copy URL',
      hasPendingReservation: { key: '', status: '' },
      pendingConfirmed: false,
    }
  },
  created(){
    this._FetchShopData();
    if (this.$store.getters.HasAuth) {
      this._FetchUserData();
      this._LastResevation();
    }
  },
  beforeRouteEnter(to, from, next){
    if (to.params.id === 'queue') {
      next({name: '404'});
      return;
    }
    next();
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.cover{
  width: 100%;
  min-height: 200px;
  background-color: $color-orange85;
}
.s-detail{
  width: -webkit-fill-available;
  max-width: 500px;
  padding: 0 1em;
  padding-bottom: 1em;
}
.lite{
  display: flex;
  text-align: left;
  &.multiline{
    white-space: pre-line;
  }
  .fa{
    padding: 0 .25em;
    align-self: flex-start;
    line-height: 1.5em;
  }
  .right{
    margin-left: auto; 
  }
  .bubble{
    color: white !important;
    font-size: .85em;
    border-radius: 5px;
    padding: 0 .49em;
    height: 1.62em;
    &.pointleft:before {
      content: "";
      z-index: 0;
      position: absolute;
      height: .5em;
      width: .5em;
      border-top: none;
      border-right: none;
      transform: translate(-.75em,.5em) rotate(45deg);
    }
    &.opening{
      border: 1px solid $color-green;
      background-color: $color-green;
    }
    &.opening:before{
      background-color: $color-green;
      border: 1px solid $color-green;
    }
    &.opening:after{
      content: "Opening";
    }
    &.closing{
      border: 1px solid $color-red;
      background-color: $color-red;
    }
    &.closing:before{
      background-color: $color-red;
      border: 1px solid $color-red;
    }
    &.closing:after{
      content: "Closed";
    }
  }
}
.column-group{
  display: grid;
  grid-template-columns: auto;
  grid-gap: .75em;
  margin: .75em 0;
  * {
    margin: 0 !important;
  }
  .huge{
    font-size: 1.5em;
    font-weight: $font-bold;
    margin: .5em 0 .5em 0;
    &.green{
      background-color: $color-green;
    }
  }
}
.urlinfo{
  width: min-content;
  margin: auto;
  border-radius: 6px;
  .copy{
    margin: 0;
    width: max-content;
    min-width: unset;
    background-color: $color-orange;
    font-weight: $font-bold;
    font-size: .9em;
    line-height: 2rem;
    padding: 0 .5rem;
    cursor: pointer;
  }
  *:first-child{
    border-radius: 6px 0 0 6px;
  }
  *:last-child{
    border-radius: 0 6px 6px 0;
  }
}
.shopurl{
    min-width: 200px;
    border: none;
    color: $color-orange !important;
    background-color: $color-orange10;
    box-shadow: 0 0 1px $color-orange inset;
    font-size: .8em !important;
    font-family: 'Kanit' !important;
    font-weight: $font-normal;
    line-height: 2rem;
    padding: 0 .25rem;
    cursor: text;
    &::selection{
      background-color: $color-orange;
      color: white;
    }
}
.shopurl:focus{
    box-shadow: inset 0 0 8px $color-orange;
}
.slide-enter-active, .slide-leave-active{
  transition: transform .3s;
}
.slide-enter, .slide-leave-to{
  transform: translateX(-275px);
}
.aside{
  position: absolute;
  display: flex;
  flex-flow: column;
  align-items: left;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(255,255,255,.95);
  // background-color: rgba(64,64,64,0.9);
  // color: white;
  box-shadow: 0 0 12px $color-grey;
  width: 275px;
  height: 100%;
  text-align: left;
  padding: 0 .75em;
  box-sizing: border-box;
  font-size: 1.2rem;
  .button{
    font-size: 1.2rem;
    width: 100%;
    padding-top: .325em;
    padding-bottom: .325em;
    margin: .325em 0;
    text-align: center;
  }
  .divider{
    // background-color: rgba(255,255,255,.5);
    background-color: $color-grey25;
    width: 100%;
  }
  .link{
    color: $color-orange;
    &.blue{
      color: $color-blue;
    }
  }
  .menu{
    color: unset;
    display: inline-block;
    line-height: 3.1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    user-select: none;
    .rightspaced{
      margin-right: .75em;
    }
  }
  .list{
    &.header{
      font-weight: $font-bold;
    }
  }
}
</style>

