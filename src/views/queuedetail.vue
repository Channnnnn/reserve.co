<template>
  <div>
    <div v-if="routeType==='shop'" class="nav orange">
        <router-link :to="'/managequeue'" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>ALL RESERVATIONS
        </router-link>
    </div>
    <div v-if="routeType==='user'" class="nav blue">
        <router-link :to="'/account'" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
        </router-link>
    </div>
    <!-- <Navbar :hasBack='true' :link="'/account'"></Navbar> -->
    <div class="queueheader" :class="[queue.status]">
      <div class="q-date">11/Sep/2017</div>
      <div class="q-label">Queue</div>
      <div class="q-order">{{queue.number}}</div>
      <div class="q-status">{{queue.status}}</div>
    </div>
    <div class="q-detail">
      <div v-if="routeType==='user'" class="shopname">{{queue.shopName}}</div>
      <div v-if="routeType==='user'" class="shopdesc">Shop Descriptions</div>
      <div v-if="routeType==='user' && queue.status === 'waiting'" class="q-action">          
        <vButton :link="'/shop2'" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
        <a @click="queueCancel" class="right red transparent mini button fullwidth"><div class="fa fa-times"></div>Cancel reservation</a>
      </div>
      <div v-if="routeType==='user' && (['accepted', 'expired', 'canceled'].includes(queue.status))" class="q-action">          
        <vButton :link="'/shop2'" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
      </div>

      <div v-if="routeType==='shop'" class="username">User's name</div>
      <div v-if="routeType==='shop'" class="userphone">User's phone no.</div>
      <div v-if="routeType==='shop' && queue.status === 'waiting'" class="q-action">          
        <a @click="queueAccept" class="green button fullwidth"><div class="fa fa-check rightspaced"></div>Accept</a>
        <a @click="queueDecline" class="red button fullwidth"><div class="fa fa-times rightspaced"></div>Decline</a>
      </div>
      <!-- <div v-if="routeType==='shop' && (['accepted', 'expired', 'canceled'].includes(queue.status))" class="q-action">          
        <vButton :link="'/shop2'" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
      </div> -->
      <div class="big divider">Queue Timestamp</div>
      <div class="q-time">
        <span>12:12 PM</span><span>Registered queue</span>
        <span>12:15 PM</span><span>Queue Ready</span>
        <span>12:16 PM</span><span>Checked in</span>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
export default {
  components: {
    Navbar,
    vButton
  },
  props: ['data'],
  data(){
    return{
      routeType: 'user',
      queue: null,
    }
  },
  methods:{ 
    GetQueueData: function() {
      console.log("Hello world")
      this.data.queues.forEach(q => {
        if (q.id == this.$route.params.id){
          this.queue = q;
        }
      });
    },
    queueCancel(){
      this.queue.status = 'canceled'
    },
    queueAccept(){
      this.queue.status = 'accepted'
    },
    queueDecline(){
      this.queue.status = 'expired'
    }
  },
  beforeRouteEnter(to,from,next){
    if (from.name === 'account' || from.name === 'shop') {
      next(vm => {
        vm.routeType = 'user';
      })
    }
    else if (from.name === 'managequeue'){
      next(vm => {
        vm.routeType = 'shop';  
      })
    }
  },
  beforeMount(){
    this.GetQueueData()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.queueheader{
  width: 100%;
  align-items: center;
  justify-content: center;
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
