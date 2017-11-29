<template>
  <div>
    <div class="nav orange">
        <router-link :to="'/shop1'" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>MY SHOP
        </router-link>
    </div>
    <div class="panel shop">
      <h2>Shop Name Reservation</h2>
      <div class="row group tab">
          <a href="#" class="blue tab" :class="{'active': showingReservation}" @click="SwitchTab('reservation')">Reservation</a>
          <a href="#" class="blue tab" :class="{'active': showingHistory}" @click="SwitchTab('history')">History</a>
      </div>
    </div>
    <div class="reservation account">
      <queue-item v-for="queue in data.queues" :key="queue.number" :data="queue"></queue-item>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
import QueueItem from '@/components/queueEntry.vue'
export default {
  components: {
    Navbar,
    QueueItem
  },
  props: ['data'],
  methods: {
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
  },
  data() {
      return {
          showingReservation: true,
          showingHistory: false,
      }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
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

