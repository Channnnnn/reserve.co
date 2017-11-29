<template>
  <div>
    <Navbar :hasBack='true' :link="'/account'"></Navbar>
    <div class="queueheader" :class="[queue.status]">
      <div class="q-date">11/Sep/2017</div>
      <div class="q-label">Queue</div>
      <div class="q-order">{{queue.number}}</div>
      <div class="q-status">{{queue.status}}</div>
    </div>
    <div class="q-detail">
      <div class="shopname">{{queue.shopName}}</div>
      <div class="shopdesc">Shop Descriptions</div>
      <div class="q-action group">          
        <vButton :link="'#'" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
        <vButton :link="'#'" class="right red transparent mini button fullwidth"><div class="fa fa-times"></div>Cancel reservation</vButton>
      </div>
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
  .shopname{
    font-size: 1.75em;
    text-align: left;
  }
  .shopdesc{
    text-align: left;
  }
}
.q-action{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: $gutter;
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
