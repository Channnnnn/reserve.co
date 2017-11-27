<template>
    <div class="queue rounded">
        <span class="q-num">27</span>
        <a class="detail" href="queue4.html">
            <span class="q-name">Shop 7</span>
            <span class="q-status waiting"></span>
            <span class="q-more fa fa-ellipsis-v"></span>
        </a>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";

.queue{
    display: grid;
    margin: 5px 0;
    border-radius: 6px;
    border: 1px solid $color-grey10;
    line-height: 3em;
    grid-template-areas: "num detail action1 action2";
    grid-template-columns: 2.5em auto min-content min-content ;
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

</style>

