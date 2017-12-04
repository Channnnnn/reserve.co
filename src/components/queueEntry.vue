<template>
    <div class="queue rounded">
        <span class="q-num">{{data.queue_number}}</span>
        <router-link :to="{name: 'queue', params: {qid: data.key}}" class="detail">
            <span class="q-name" v-if="$route.name === 'account'">{{data.shop_name}}</span>
            <span class="q-name" v-if="$route.name === 'managequeue'">{{data.user_display_name}}</span>
            <span class="q-status" :class="[data.status]"></span>
            <span class="q-more fa fa-ellipsis-v"></span>
        </router-link>
        <a @click="queueAccept" v-if="$route.name==='managequeue' && data.status === 'waiting'" class="accept button"></a>
        <a @click="queueDecline" v-if="$route.name==='managequeue' && data.status === 'waiting'" class="decline button"></a>
        <a @click="queueCancel" v-if="$route.name==='account' && data.status === 'waiting'" class="cancel button"></a>
    </div>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config'
export default {
    name: 'queue',
    props: ['data'],
    // data() {
    //     return {
    //         details: {}
    //     }
    // },
    // watch: {
    //     'data' : function (newData, OldData) { 
    //         console.log('New:' + newData + " Old:" + OldData);
    //         // _FetchExtraData();
    //      }
    // },
    methods: {
        queueAccept(){
            // this.data.status = 'accepted'
            var queue_id = this.data.key;
            var queueRef = db.ref('queues').child(queue_id);
            queueRef.update({
                status: 'accepted',
                timestamp_complete: Date.now()
            });
        },
        queueDecline(){
            // this.data.status = 'expired'
            var queue_id = this.data.key;
            var queueRef = db.ref('queues').child(queue_id);
            queueRef.update({
                status: 'expired',
                timestamp_complete: Date.now()
            });
        },
        queueCancel(){
            var queue_id = this.data.key;
            var queueRef = db.ref('queues').child(queue_id);
            queueRef.update({
                status: 'canceled',
                timestamp_complete: Date.now()
            });
        },
    },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";

.queue{
    min-width: 300px;
    display: grid;
    margin: 5px 0;
    border-radius: 6px;
    border: 1px solid $color-grey10;
    line-height: 3em;
    grid-template-areas: "num detail action1 action2";
    grid-template-columns: 2.5em auto min-content min-content ;
    * {
        border-radius: 0;
    }
    :first-child {
        border-radius: 5px 0 0 5px !important;
    }
    > :last-child, > :last-child > :last-child {
        border-radius: 0 5px 5px 0 !important;
    }
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
    &:hover > .q-more{
        background-color: $color-grey10 !important;
    }
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
    &.accepted::after{
        content: "ACCEPTED";
        color: $color-green;
    }
    &.waiting::after{
        content: "WAITING";
        color: $color-blue;
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

.button{
    line-height: unset;
    padding: 0;
    width: 3.25rem;
    min-width: unset;
    &.accept{
        background-color: $color-blue85;
        border-right: 1px solid $color-grey;
        &::before {
            content: "\f00c";
            font-family: 'FontAwesome';
            display: block;
            font-size: 1.3em;
        }
    }
    &.decline{
        background-color: $color-red85;
        &::before{
            content: "\f00d";
            font-family: 'FontAwesome';
            display: block;
            font-size: 1.3em;
        }
    }
    &.dismiss{
        background-color: $color-grey85;
        width: 5.9em;
        &::before{
            content: "DISMISS";
            font-family: 'Kanit','Arial', sans-serif;
            display: block;
            font-size: 1em;
        }
    }
    &.cancel{
        background-color: $color-red85;
        width: 5.9em;
        &::before{
            content: "CANCEL";
            font-family: 'Kanit','Arial', sans-serif;
            display: block;
            font-size: 1em;
        }
    }
}

</style>

