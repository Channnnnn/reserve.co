<template>
  <div>
    <div class="nav orange">
        <a @click="backToShop" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY SHOP
        </a>
    </div>
    <div class="panel shop">
      <h2>Shop Name Reservation</h2>
      <div class="row group tab">
          <a href="#" class="blue tab" :class="{'active': showingReservation}" @click="SwitchTab('reservation')">Reservation</a>
          <a href="#" class="blue tab" :class="{'active': showingHistory}" @click="SwitchTab('history')">History</a>
      </div>
    </div>
    <div class="reservation account">
      <QueueItem v-if="data" v-for="queue in _Queues()" :key="queue.key" :data="queue"></QueueItem>
    </div>
  </div>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config'
import Navbar from '@/components/navigationbar.vue'
import QueueItem from '@/components/queueEntry.vue'
export default {
  components: {
    Navbar,
    QueueItem
  },
  // props: ['data'],
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
          this.showingHistory = false;
        }
        else if (input === "history") {
          this.showingReservation = false;
          this.showingHistory = true;
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
        return qu;
      }
  },
  created() {
    this._FetchShopQueues()
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

