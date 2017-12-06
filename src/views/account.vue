<template>
    <div v-if="user && userdata">
        <div class="nav blue">
            <a class="menu link" @click="toggleAside">
                <div class="fa fa-bars rightspaced"></div>MY ACCOUNT
            </a>
            <vButton v-if="userdata.shop_list" :link="{name: 'shop', params: {id: firstShopInList}}" class="mini transparent button right">Switch to Shop</vButton>
        </div>
        <AccountPanel :data="user" class="panel">
            <div class="row group tab">
                <a class="blue tab" :class="{'active': showingReservation}" @click="SwitchTab('reservation')">Reservation</a>
                <a class="blue tab" :class="{'active': !showingReservation}" @click="SwitchTab('history')">History</a>
            </div>
        </AccountPanel>
        <div class="reservation account" v-if="showingReservation">
            <div class="waiting-group">
                <QueueItem v-if="!_IsHistory(queue) && queue.status === 'waiting'" v-for="queue in _Reservations()" :key="queue.key" :data="queue"></QueueItem>
            </div>
            <div class="accepted-group">
                <QueueItem v-if="!_IsHistory(queue) && queue.status === 'accepted'" v-for="queue in _Reservations()" :key="queue.key" :data="queue"></QueueItem>
            </div>
            <div class="declined-group">
                <QueueItem v-if="!_IsHistory(queue) && (queue.status === 'canceled' || queue.status === 'expired')" v-for="queue in _Reservations()" :key="queue.key" :data="queue"></QueueItem>
            </div>
        </div>
        <div class="reservation account" v-if="!showingReservation">
            <QueueItem v-if="_IsHistory(queue)" v-for="queue in _Reservations()" :key="queue.key" :data="queue"></QueueItem>
        </div>
        
        <label class="search" for="searchID">
            <a :data-shop-id-result="searchResult" class="before-after-space huge blue transparent button">
                Make Reservation<input @keyup.enter="SearchShop" v-model="searchQuery" required type="text" name="searchID" id="searchID" placeholder="Enter Shop ID"/>
                <a class="minibutton" @click="SearchShop">GO</a>
            </a>
        </label>
        
        <transition name="slide">
        <div class="aside" v-if="showAside">
            <a class="menu link" @click="toggleAside">
                <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
            </a>
            <router-link :to="{name: 'settings'}" class="list blue link">Settings</router-link>
            <router-link :to="{name: 'setupshop'}" class="list orange button transparent">Setup a Shop</router-link>
            <span class="mini divider"></span>
            <div class="list header">Shop list</div>
            <router-link :to="{name: 'shop', params: {id: shop}}" v-for="shop in userdata.shop_list" :key="shop" class="list blue link">{{shop}}</router-link>
            <Logout></Logout>
            <!-- <a class="list red button"><div class="fa fa-sign-out"></div>Sign out</a> -->
        </div>
        </transition>
        <transition name="fade">
            <div v-if="showAside" class="aside-hide" @mousedown.left="closeAside" key="not-aside"></div>
        </transition>
        <!-- <transition name="modal" mode="out-in">
            <Modal :visible.sync="showModal" v-if="showModal">
                <h2>Visit Shop</h2>
                <input class="searchbox" type="text" name="shop-link" id="shopLink" placeholder="Enter Shop ID" />
            </Modal>
        </transition> -->
    </div>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config';
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
import AccountPanel from "@/components/accountPanel.vue"
import QueueItem from '@/components/queueEntry.vue'
import Logout from '@/components/logoutButton.vue';
// import Modal from '@/components/modalDialog.vue';

export default {
    components: {
        Navbar,
        QueueItem,
        AccountPanel,
        vButton,
        Logout,
        // Modal
    },
    computed:{
        user: function(){
            return this.$store.getters.HasAuth;
        },
        reservations: function(){
            return this.$store.getters.GetUserReservation;
        },
        userdata: function(){
            return this.$store.getters.UserData;
        },
        firstShopInList: function(){
            if (this.userdata){
                for (var first in this.userdata.shop_list){
                    return first;
                }
            }
        }
    },
    watch: {
        'user': function(){
            this._CheckAuth();
            this._GetUserData();
            if (this.notFetchedOnCreate) {
                this._GetUserAllReservation();
            }
        },
        'userdata': '_GetUserAllReservation',
        'searchQuery': 'ClearQuery'
    },
    methods: {
        _CheckAuth(){
            if (!this.user) {
                this.$router.replace({name: 'session'});
            }
        },
        SwitchTab(input){
            if (input === "reservation"){
                this.showingReservation = true;
            }
            else if (input === "history") {
                this.showingReservation = false;
            }
        },
        toggleAside(){
            this.showAside = !this.showAside
        },
        closeAside(){
            this.showAside = false;
        },
        _GetCurrentUser(){
            this.$store.dispatch('onFetchUser', auth.currentUser);
        },
        _GetUserData(){
            if (this.user){
                let self = this;
                var ref = db.ref('users/' + self.user.uid);
                ref.on('value', function(snap){
                    self.$store.dispatch('onSyncUserData', snap.val());
                }, function(err) { console.log('Error getting user data\n' + err.code); })
            }
        },
        _Reservations(){
            var reserve = []
            var reservations = this.reservations;
            for (const r in reservations){
                reserve.push(Object.assign({key: r}, reservations[r]));
            }
            return reserve.reverse();
        },
        _IsHistory(item){
            let self = this;
            var timeMark = item.key;
            return self._CheckShouldBeHistory(timeMark);
        },
        _GetUserAllReservation(){
            let self = this;
            self.$store.dispatch('onLoadingAsync',true);
            var ref = db.ref("queues").orderByChild('user_id').equalTo(self.user.uid);
            ref.on("value", function(snapshot) {
                self.$store.dispatch('onLoadingAsync',false);
                self.$store.dispatch('onSyncAllReservations', snapshot.val());
            }, function(error) {
                console.log("Error while retrieving Reservation\n" + error);
                self.$store.dispatch('onLoadingAsync',false);
                return [];
            });
        },

        _CheckShouldBeHistory(timestamp){
            if (!timestamp){
                return false;
            }
            else {
                let unixTime = parseInt(Date.now());
                return (unixTime - timestamp) > 86400000;
            }
        },

        SearchShop: function(){
            var self = this;
            if (this.searchQuery != ''){
                var searchRef = db.ref('shops/' + self.searchQuery);
                searchRef.once('value', function(snap){
                    if (snap.val()){
                        self.$router.push({name: 'shop', params: {id: self.searchQuery}})
                    }
                    else {
                        self.searchResult = 'Invalid Shop ID'
                    }
                })
            }
        },
        ClearQuery: function(){
            if (this.searchResult != '') this.searchResult = '';
        }
    },
    data() {
        return {
            showingReservation: true,
            showAside: false,
            notFetchedOnCreate: false,
            searchQuery: '',
            searchResult: ''
        }
    },
    created(){
        // this._GetCurrentUser();
        if (this.user) {
            this._GetUserAllReservation();
        }
        else {
            this.notFetchedOnCreate = true;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (!vm.$store.getters.HasAuth){
            vm.$router.push({name: 'login'});
        }
        });
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
hr{
    border: 0;
    border-bottom: 1px solid $color-grey25;
}

.waiting-group:not(:empty) + .accepted-group:not(:empty){
    &::before{
        content: "";
        display: block;
        margin: 1em 0;
        border: 0;
        border-bottom: 1px solid $color-grey25;
    }
}

.accepted-group:not(:empty) + .declined-group:not(:empty),
.waiting-group:not(:empty) + .accepted-group:empty + .declined-group:not(:empty){
    &::before{
        content: "";
        display: block;
        margin: 1em 0;
        border: 0;
        border-bottom: 1px solid $color-grey25;
    }
}

.search{
    position: relative;
    a{
        &:hover{
            color: saturate(hsl(193, 66%, 45%), 50%);
            filter: none;
        }
        display: flex;
        flex-flow: column;
        justify-content: center;
        &:after{
            content: attr(data-shop-id-result);
            font-size: 1rem;
            height: 0;
            position: relative;
            top: -.5rem;
        }
    }
    .minibutton{
        display: block;
        position: absolute;
        width: fit-content;
        padding: .4em;
        margin-left: auto;
        font-size: 1.25rem;
        right: 1.25em;
        box-sizing: border-box;
        margin-top: 0.5em;
        border-radius: 0 5px 5px 0;
        height: 0;
        visibility: hidden;
        transition: all .15s;
        background-color: transparent;
        color: transparent;
    }
    input{
        box-sizing: border-box;
        height: 0;
        width: 200px;
        padding: 0 1em;
        border: none;
        outline: none;
        transition: all .15s;
        &:focus, &:valid, &:active{
            height: unset;
            width: 200px;
            margin: 1em 0;
            padding: .5em 1em;
            border-radius: 5px;
            border: 1px solid $color-green;
            background-color: white;
            box-shadow: 0 0 0 $color-blue;
            z-index: 1;
            font-family: 'Kanit', Arial, Helvetica, sans-serif;
            font-weight: $font-normal;
            & + .minibutton{
                height: unset;
                visibility: visible;
                z-index: 15;
                padding: .4em;
                background-color: #8fbe0d;
                color: white;
                &:hover{
                    filter: brightness(1.1) saturate(.9);
                    box-shadow: 0 0 3px;
                }
                &:active{
                    filter: brightness(0.9);
                }
            }
        }
    }
}

.modal-leave-active{
  transition: all .15s;
}

.modal-leave-to{
  opacity: 0;
  z-index: 5;
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

// .button .fa:first-child{
//     margin-right: .25em;
//     margin-bottom: .25em;
// }
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
    padding-left: .5em;
    line-height: 1.1em;
}

.q-status {
    grid-area: status;
    text-align: left;
    align-self: start;
    font-weight: $font-bold;
    padding-left: .5em;
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
