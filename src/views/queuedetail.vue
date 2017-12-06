<template>
  <div v-if="!Ready">
    <div class="nav dummy hidden"></div>
    <div class="queueheader">
      <div class="q-date dummy">00/00/0000</div>
      <div class="q-label dummy">Queue</div>
      <div class="q-order dummy hidden">~</div>
      <div class="q-status dummy"></div>
    </div>
    <div class="q-detail">
      <div class="shopname dummy">#</div>
      <div class="shopdesc dummy">~</div>
      <div class="q-action">          
        <div class="dummy">View Shop</div>
      </div>
      <div class="big divider dummy hidden">Queue Timestamp</div>
      <div class="q-time">
        <span class="dummy">!!!!!!</span>
        <span class="dummy">Registered queue</span>
      </div>
    </div>
  </div>
  <div v-else-if="Ready">
    <div v-if="shopOwner" class="nav orange">
        <router-link :to="{name: 'managequeue', params: {id: queuedata.shop_id}}" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>ALL RESERVATIONS
        </router-link>
    </div>
    <div v-if="!shopOwner" class="nav blue">
        <router-link :to="{name: 'account'}" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
        </router-link>
    </div>
    <!-- <Navbar :hasBack='true' :link="'/account'"></Navbar> -->
    <div class="queueheader" :class="[queuedata.status]">
      <div class="q-date">{{queueDate}}</div>
      <div class="q-label">Queue</div>
      <div class="q-order">{{queuedata.queue_number}}</div>
      <div class="q-status">{{queuedata.status}}</div>
    </div>
    <div class="q-detail">
      <div v-if="!shopOwner" class="shopname">{{queuedata.shop_name}}</div>
      <div v-if="!shopOwner" class="shopdesc">{{queuedata.user_display_name}}</div>
      <div v-if="!shopOwner && queuedata.status === 'waiting'" class="q-action">          
        <vButton :link="{name: 'shop', params: {id: queuedata.shop_id}}" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
        <a @click="queueCancel" class="right red transparent mini button fullwidth"><div class="fa fa-times"></div>Cancel reservation</a>
      </div>
      <div v-if="!shopOwner && (['accepted', 'expired', 'canceled'].includes(queuedata.status))" class="q-action">          
        <vButton :link="{name: 'shop', params: {id: queuedata.shop_id}}" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
      </div>

      <div v-if="shopOwner" class="username">{{queuedata.user_display_name}}</div>
      <div v-if="shopOwner" class="userphone">{{queuedata.user_phone_number}}</div>
      <div v-if="shopOwner && queuedata.status === 'waiting'" class="q-action">          
        <a @click="queueAccept" class="green button fullwidth"><div class="fa fa-check rightspaced"></div>Accept</a>
        <a @click="queueDecline" class="red button fullwidth"><div class="fa fa-times rightspaced"></div>Decline</a>
      </div>
      <!-- <div v-if="routeType==='shop' && (['accepted', 'expired', 'canceled'].includes(queuedata.status))" class="q-action">          
        <vButton :link="'/shop2'" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
      </div> -->
      <div class="big divider">Queue Timestamp</div>
      <div class="q-time">
        <span>{{GetQueueTime($route.params.qid)}}</span>
        <span>Registered queue</span>
        <span v-if="queuedata.timestamp_complete">{{GetQueueTime(queuedata.timestamp_complete)}}</span>
        <span v-if="queuedata.timestamp_complete">Queue {{queuedata.status}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config'
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
export default {
  components: {
    Navbar,
    vButton
  },
  data(){
    return{
      routeType: 'user',
      Ready: false
    }
  },
  computed: {
    user: function(){
      return this.$store.getters.HasAuth;
    },
    userdata: function(){
      return this.$store.getters.UserData;
    },
    queuedata: function(){
      return this.$store.getters.CurrentQueueData;
    },
    queueOwner: function(){
      return this.user.uid===this.queuedata.user_id
    },
    shopOwner: function(){
      if (this.userdata && this.userdata.shop_list && this.queuedata){
        return Object.values(this.userdata.shop_list).includes(this.queuedata.shop_id);
      }
      else{
        return false;
      }
    },
    queueDate: function(){
      let date = this.UnixTimeToDate(this.$route.params.qid);
      return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()
    }
  },
  methods:{
    UnixTimeToDate: function(value){
      if ((value + '').length === 10){
        value = value * 1000;
      }
      var time = new Date(parseInt(value));
      // console.log(time);
      return time;
    },
    GetQueueTime: function(value){
      let date = this.UnixTimeToDate(parseInt(value));
      return date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
      // return date.getHours()+':'+date.getMinutes()
    },
    _FetchQueueData: function() {
      var self = this;
      var queue_id = this.$route.params.qid;
      // console.log(this.$route)
      var queueRef = db.ref('queues/' + queue_id);
      queueRef.on('value', function(snap){

        let queueData = snap.val();
        self.$store.dispatch('onFetchCurrentQueueData', queueData);

        if (queueData){
          // console.log(queueData);
          //GET SHOP DATA
          let shopOfQueueRef = db.ref('shops/' + queueData.shop_id);
          shopOfQueueRef.once('value', function(snap){

            self.$store.dispatch('onFetchCurrentShopData', snap.val());
            self.Ready = true;

          }, function(err) {
            console.log('Error fetching Shop data of queue\n' + err.code);
          });

          //GET USER DATA
          // let userOfQueueRef = db.ref('users/' + queueData.user_id);
          // userOfQueueRef.once('value', function(snap){

          //   self.$store.dispatch('onFetchCurrentQueueUserData', snap.val());
          
          // }, function(err) {
          //   console.log('Error fetching User data of queue\n' + err.code);
          // })

        }
        else {
          console.log('Queue does not exist');
          //queue not exist
        }

      }, function(err) {
        console.log('Error fetching queue data\n' + err.code);
      });      
    },
    queueCancel(){
      // this.queue.status = 'canceled'
      var queue_id = this.$route.params.qid;
      var queueRef = db.ref('queues').child(queue_id);
      queueRef.update({
        status: 'canceled',
        timestamp_complete: Date.now()
      });
    },
    queueAccept(){
      // this.queue.status = 'accepted'
      var queue_id = this.$route.params.qid;
      var queueRef = db.ref('queues').child(queue_id);
      queueRef.update({
        status: 'accepted',
        timestamp_complete: Date.now()
      });
    },
    queueDecline(){
      // this.queue.status = 'expired'
      var queue_id = this.$route.params.qid;
      var queueRef = db.ref('queues').child(queue_id);
      queueRef.update({
        status: 'expired',
        timestamp_complete: Date.now()
      });
    }
  },
  created(){
    this.Ready = false;
    this._FetchQueueData()
  },
  beforeRouteLeave(to, from, next){
    if (to.name === 'queue') {
      this.Ready = false;
      next();
    }
    else {
      next();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.queueheader{
  width: 100%;
  align-items: center;
  justify-content: center;
  * {
      width: fit-content;
      margin: 0 auto;
  }
  &.ready{
    .q-date, .q-label, .q-order{
      color: $color-blue;
    }
    .q-status{
      background-color: $color-blue;
    }
  }
  &.canceled{
    .q-date, .q-label, .q-order{
      color: $color-grey;
    }
    .q-status{
      background-color: $color-grey;
    }
  }
  &.expired{
    .q-date, .q-label, .q-order{
      color: $color-red;
    }
    .q-status{
      background-color: $color-red;
    }
  }
  &.accepted{
    .q-date, .q-label, .q-order{
      color: $color-green;
    }
    .q-status{
      background-color: $color-green;
    }
  }
  .q-label{
    line-height: 1em;
    font-size: 3em;
    font-weight: $font-bold;
    user-select: none;
  }
  .q-order {
    line-height: 1em;
    font-size: 8em;
    font-weight: $font-bold;
    user-select: none;
  }
}
.q-status {
  width: 100%;
  line-height: 1.75em;
  height: 1.75em;
  font-size: 1.5em;
  text-transform: uppercase;
  color: white;
  background-color: #2c3e50;
}
.q-detail{
  width: -webkit-fill-available;
  max-width: 400px;
  margin: 0 1em;
  margin-top: .5em; 
  .shopname, .username{
    font-size: 1.75em;
    text-align: left;
  }
  .shopdesc, .userphone{
    text-align: left;
  }
}
.q-action{
  display: grid;
  grid-auto-flow: column; 
  grid-template-columns: auto;
  grid-gap: $gutter;
  margin: 1em 0;
}
.q-time{
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: .5em 0;
  & > :nth-child(2n) {
    text-align: left;
  }
}
</style>
