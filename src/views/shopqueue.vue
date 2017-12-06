<template>
  <div v-if="shopdata && $store.getters.HasAuth && shopdata.owner === $store.getters.HasAuth.uid">
    <div class="nav orange">
        <a @click="backToShop" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY SHOP
        </a>
    </div>
    <div class="panel shop">
      <h2>{{shopdata.name}} Reservation</h2>
      <div class="row group tab">
          <a href="#" class="blue tab" :class="{'active': showingReservation}" @click="SwitchTab('reservation')">Reservation</a>
          <a href="#" class="blue tab" :class="{'active': !showingReservation}" @click="SwitchTab('history')">History</a>
      </div>
    </div>
    <div class="reservation account">
      <div v-if="showingReservation">
        <QueueItem v-if="!_IsHistory(queue)" v-for="queue in _Queues()" :key="queue.key" :data="queue"></QueueItem>
      </div>
      <div v-if="!showingReservation">
        <QueueItem v-if="_IsHistory(queue)" v-for="queue in _Queues()" :key="queue.key" :data="queue"></QueueItem>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {db,auth} from '@/scripts/firebase_config'
import Navbar from '@/components/navigationbar.vue'
import QueueItem from '@/components/queueEntry.vue'
export default {
  components: {
    Navbar,
    QueueItem
  },
  // props: ['data'],
  computed: {
    shopdata: function() {
      return this.$store.getters.CurrentShopData;
    },
  },
  watch: {
    shopdata: '_FetchShopQueues'
  },
  data(){
    return {
      data: {},
      showingReservation: true,
      showingHistory: false,
    }
  },
  methods: {
      backToShop(){
        this.$router.push({name: 'shop', params: {id: this.$route.params.id}});
      },
      SwitchTab(input){
        if (input === "reservation"){
          this.showingReservation = true;
          // this.showingHistory = false;
        }
        else if (input === "history") {
          this.showingReservation = false;
          // this.showingHistory = true;
        }
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
      },
      _FetchShopQueues: function(){
        let self = this;
        var queues = [];
        var queueQuery = db.ref('queues').orderByChild('shop_id').equalTo(self.$route.params.id);
        queueQuery.on('value', function(snap) {
          // console.log(snap.val());
          self.data = snap.val();
        }, function(err){
          console.log('Error while fetching shop queue record\n' + err.code);
        })
      },
      _Queues(){
        var qu = []
        var queues = this.data;
        for (const q in queues) {
          qu.push(Object.assign({key: q}, queues[q]));
        }
        return qu.reverse();
      },
      _IsHistory(item){
          let self = this;
          var timeMark = item.key;
          var shopOpenTime = self.shopdata.open_time;
          var isBeforeShopOpen = timeMark < moment(moment().format('L ') + shopOpenTime);
          // console.log(parseInt(timeMark)<moment())
          // if (item.timestamp_complete) timeMark = item.timestamp_complete;
          return (self._CheckShouldBeHistory(timeMark) || isBeforeShopOpen);
      },
      _CheckShouldBeHistory(timestamp){
          if (!timestamp){
              return false;
          }
          else {
              let unixTime = parseInt(Date.now());
              return (unixTime - timestamp) > 86400000;
          }
      }
  },
  created() {
    if (this.$store.getters.HasAuth){
      this._FetchShopData()
    }
    else {
      this.$router.push({name: 'shop', params: {id: this.$route.params.id}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.nav, .panel{
  left: 0;
}
.panel{
    min-width: 300px;
    width: 100%;
    position: fixed;
    background-color: white;
    box-shadow: 0 0 10px $color-grey50;
    z-index: 1;
}
.panel .tab{
    margin: 0 auto;
    max-width: 500px;
}
.reservation{
  width: -webkit-fill-available;
  max-width: 500px;
  padding: 0 0.5em;
}
</style>

