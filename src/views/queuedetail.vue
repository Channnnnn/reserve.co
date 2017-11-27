<template>
  <div>
    <div class="queueheader">
      <div class="column group nomargin">
        <div class="q-date">11/Sep/2017</div>
        <div class="q-label">Queue</div>
        <div class="q-order">{{queue.number}}</div>
      </div>
    </div>
    <div class="q-band servicing">{{queue.status}}</div>
    <div class="main">
      <div class="column group">
        <li class="lite em xspaced">{{queue.shopName}}</li>
        <li class="lite xspaced">Shop Descriptions</li>
        <!-- <span class="invisible mini divider"></span> -->
        <div class=" q-action a1row group buttons">          
          <vButton href="#" class="blue transparent mini button fullwidth"><div class="fa fa-search"></div>View Shop</vButton>
          <vButton href="#" class="right red transparent mini button fullwidth"><div class="fa fa-times"></div>Cancel reservation</vButton>
        </div>
        <div class="big divider">Queue Timestamp</div>
        <div class="q-time">
          <span>12:12 PM</span><span>Registered queue</span>
          <span>12:15 PM</span><span>Queue Ready</span>
          <span>12:16 PM</span><span>Checked in</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vButton from "@/components/button.vue"
export default {
  components: {
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
  display: flex;
  margin: 1em 0;
  align-items: center;
  justify-content: center;
  .q-date{
    line-height: 2em;
    color: unset !important
  }
  .q-label{
    line-height: 1em;
    font-size: 3em;
    font-weight: $font-bold;
    user-select: none;
  }
  .q-order {
    line-height: .8em;
    font-size: 8em;
    font-weight: $font-bold;
    user-select: none;
  }
}
.q-band {
  width: 100%;
  line-height: 1.75em;
  height: 1.75em;
  font-size: 1.5em;
  text-transform: uppercase;
  color: white;
  background-color: #2c3e50;
}
.main{
  width: -webkit-fill-available;
  min-width: 300px;
  margin: 0 25% 0 25%;
  padding: 1em 0;
}
.q-action{
  display: flex;
  flex-direction: row;
  margin: 1em ($gutter * (-1)) !important;
  > * {
    // font-size: .8em;
    margin: 0 $gutter/2;
  }
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
