<template>
    <div>
        <div class="nav">
            <a class="menu link" @click="toggleAside">
                <div class="fa fa-bars rightspaced"></div>MY ACCOUNT
            </a>
            <vButton :link="'/shop1'" class="mini transparent button right">Switch to Shop</vButton>
        </div>
        <!-- <Navbar :hasBack='false' :link="'/settings'"> -->
            <!-- <vButton :link="'/shop' + '1'" class="mini blue transparent button right">Manage Shop</vButton> -->
        <!-- </Navbar> -->
        <AccountPanel class="panel">
            <div class="row group tab">
                <a href="#" class="blue tab" :class="{'active': showingReservation}" @click="SwitchTab('reservation')">Reservation</a>
                <a href="#" class="blue tab" :class="{'active': showingHistory}" @click="SwitchTab('history')">History</a>
            </div>
        </AccountPanel>
        <div class="reservation account">
            <queue-item v-for="queue in data.queues" :key="queue.number" :data="queue"></queue-item>
        </div>
        <vButton :link="'#'" class="before-after-space huge blue transparent button">Make Reservation</vButton>
        <transition name="slide">
        <div class="aside" v-if="showAside">
            <a class="menu link" @click="toggleAside">
                <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
            </a>
            <router-link :to="'/settings'" class="list link">Settings</router-link>
            <router-link :to="'/setupshop'" class="list orange button transparent">Setup a Shop</router-link>
            <span class="mini divider"></span>
            <div class="list header">Shop list</div>
            <router-link :to="'/shop1'" class="list link">Shop 1</router-link>    
            <div class="aside-hide" @mousedown.left="closeAside"></div>
        </div>
        </transition>
    </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
import AccountPanel from "@/components/accountPanel.vue"
import QueueItem from '@/components/queueEntry.vue'
export default {
    components: {
        Navbar,
        QueueItem,
        AccountPanel,
        vButton
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
      toggleAside(){
          this.showAside = !this.showAside
      },
      closeAside(){
          this.showAside = false;
      }
  },
  data() {
      return {
          showingReservation: true,
          showingHistory: false,
          showAside: false
      }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
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
    &.orange{
        border-color: $color-orange;
        color: $color-orange;
        &.transparent{
            background-color: transparent !important;
        }
        &:hover{
            box-shadow: 0 0 3px;
        }
    }
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
    color: $color-blue;
    &.orange{
        color: $color-orange;
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
.aside-hide{
  content: "";
  width: calc(100vw - 275px);
  height: 100%;
  position: absolute;
  left: 275px;
  // background-color: $color-grey10;
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

/* SECTION PROPERTIES : for text layout */
.reservation{
    max-width: 500px;
    width: calc(100% - 1em);
}

/* 
 *  BUTTON COMPONENTS
*/
.row.group > a.button{
    margin: 0 $gutter;
}

.column.group > a.button{
    margin: $gutter 0;
}

/* EMPHASIZED BUTTON */
.group .em.button{
    margin: 1em 0;
}

a.tab:hover{
    filter: brightness(.75) saturate(1.5);
}

.spaced{
    width: 1em;
    text-align: center;
    margin-left: .25em;
    margin-right: .25em;
}

.rightspaced{
    margin-left: .25em;
    margin-right: .75em;
}

.xspaced{
    min-width: max-content;
    width: 1em;
    text-align: center;
    margin-left: .5rem;
    margin-right: .5rem;
}

.button .fa:first-child{
    margin-right: .25em;
    margin-bottom: .25em;
}
.mini .fa:last-child{
    margin: -.1em 0 0 .25em;
}
.mini .fa:first-child{
    margin: -.1em .25em 0 0;
}

/*
 *
 *  Footer Elements  
 *
*/

.footer{
    margin-top: auto;
    margin-bottom: .5em;
    font-weight: $font-normal;
    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        li {
            display: inline-block;
            &::after {
                content: " · ";
            }
            &:last-child::after {
                content: "";
            }
        }
    }
    a{
        color: $color-blue;
        opacity: $opacity-link;
        &:hover{
            opacity: 1;
        }
    }
}

/*
 *
 *  Shop Elements
 *
*/
.main{
    width: -webkit-fill-available;
    min-width: 300px;
    margin: 0 25% 0 25%;
}

.reservation.main{
    /*max-width: 320px;*/ /* FORCEMOBILE */
    min-width: max-content;
    margin-left: .5em !important;
    margin-right: .5em !important;
}

a.link{
    display: inline-block;
    opacity: $opacity-link;
}

.red, .red.link{
    color: $color-red;
}

.blue, .blue.link {
    color: $color-blue;
}

.shopdescription{
    align-self: flex-start;
    padding-top: .25em;
}

.urlinfo{
    width: min-content;
    margin: auto;
    border-radius: 6px;
}

.queue{
    display: grid;
    margin: 5px 0;
    border-radius: 6px;
    border: 1px solid $color-grey10;
    line-height: 3em;
    grid-template-areas: "num detail action1 action2";
    grid-template-columns: 2.5em auto min-content min-content ;
}

.q-num{
    grid-area: num;
    background-color: $color-grey10;
    color: $color-grey;
}

a.detail{
    display: grid;
    grid-template-columns: auto 3em;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "name more" "status more";
    vertical-align: middle;
    color: unset;
}
a.detail:hover .q-more{
    background-color: $color-grey10 !important;
}

.q-name{
    grid-area: name;
    text-align: left;
    align-self: end;
    padding: 0 .5em 0 .5em;
    line-height: 1.1em;
}

.q-status {
    grid-area: status;
    text-align: left;
    align-self: start;
    font-weight: $font-bold;
    padding: 0 .5em 0 .5em;
    line-height: 1.1em;
    /* Status Text */
    &.servicing::after{
        content: "SERVICING";
        color: $color-blue;
    }
    &.checkedout::after{
        content: "CHECKED OUT";
        color: $color-green;
    }
    &.ready::after{
        content: "READY";
        color: $color-blue;
    }
    &.waiting::after{
        content: "WAITING";
        color: black;
    }
    &.expired::after{
        content: "EXPIRED";
        color: $color-red;
    }
    &.canceled::after{
        content: "CANCELED";
        color: $color-grey;
    }
}

.q-more {
    grid-area: more;
    line-height: unset !important;
    color: $color-grey50;
    font-size: 1.2em !important;
    transition: all .15s;
}

/* Queue Action Button Reformat */
.unsetbtn{
    line-height: inherit !important;
    font-size: unset !important;
    padding: unset !important;
    margin: unset !important;
    min-width: unset !important;
    border-radius: unset !important;
    &::before{
        font-weight: $font-bold;
    }
}

/* Check out */
a.checkout.button{
    grid-area: 1 / 3 / 3 / 5;
    width: 7em;
    background-color: $color-green85 !important;
    &:hover{
        background-color: $color-green !important;
    }
    &::before{
        content: "CHECK OUT";
    }
}

/* Check in */
a.checkin.button{
    grid-area: action1;
    width: 3.5em;
    background-color: $color-blue85 !important;
    border-right: 1px solid rgba(255,255,255,.5);
    &:hover{
        background-color: $color-blue !important;
    }
    &::before{
        content: "";
        font-family: 'FontAwesome';
        display: block;
        font-size: 1.3em;
    }
}

/* Expire */
a.expire.button{
    grid-area: action2;
    width: 3.5em;
    background-color: $color-blue85 !important;
    &:hover{
        background-color: $color-blue !important;
    }
    &::before{
        content: "";
        font-family: 'FontAwesome';
        display: block;
        font-size: 1.3em;
    }
}

/* Dismiss */
a.dismiss.button{
    grid-area: 1 / 3 / 3 / 5;
    width: 7em;
    background-color: $color-grey10 !important;
    &:hover{
        background-color: $color-grey25 !important;
    }
    &::before{
        content: "DISMISS";
        color: $color-grey;
    }
}



/* 
 *
 *  SHOPFORM ELEMENT
 *
*/
.shopform{
    display: grid;
    grid-template-columns: 1em auto;
    grid-template-areas: "glyph form";
    grid-template-rows: auto;
    align-items: center;
    grid-gap: .25rem;
    .fa-pencil{
        grid-area: glyph;
    }
    .wide.button{
        grid-column: 2 span;
    }
}

/* 
 *
 *  QUEUE ELEMENT
 *
*/
.q-date{
    line-height: 2em;
    color: unset !important;
}

.q-label{
    line-height: 1em;
    font-size: 3em;
    font-weight: $font-bold;
    user-select: none;
}

.q-order{
    line-height: .8em;
    font-size: 8em;
    font-weight: $font-bold;
    user-select: none;
}

.left.previous{
    order: -1;
    padding: 1em;
    opacity: 0.25;
    &::after{
        content: "";
        font-family: 'FontAwesome';
        font-size: 3em;
    }
    &:hover{
        background-color: $color-grey10;
    }
}

.right.next{
    padding: 1em;
    opacity: 0.25;
    &::after{
        content: "";
        font-family: 'FontAwesome';
        font-size: 3em;
    }
    &:hover{
        background-color: $color-grey10;
    }
}

.q-band{
    width: 100%;
    line-height: 1.75em;
    font-size: 1.5em;
    color: white;
}

.servicing .q-detail > *, .ready .q-detail > *{
    color: $color-blue;
}
.checkedout .q-detail > *{
    color: $color-green;
}
.waiting .q-detail > *{
    color: black;
}
.servicing + .q-band, .ready + .q-band{
    background-color: $color-blue;
}
.checkedout + .q-band{
    background-color: $color-green;
}
.waiting + .q-band{
    background-color: black;
}
.servicing + .q-band::after{content: "Servicing";}
.ready + .q-band::after{content: "Ready";}
.checkedout + .q-band::after{content: "Checked out";}
.waiting + .q-band::after{content: "Waiting";}

.q-time{
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: .5em 0;
}
.q-time > :nth-child(2n){
    text-align: left;
}

/* 
 *
 *  ACCOUNT ELEMENTS
 *
*/
.avatar {
    display: block;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: none;
    background-color: lightgrey;
    margin: 0 auto;
    margin-top: 1em;
}
</style>
