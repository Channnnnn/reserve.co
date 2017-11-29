<template>
    <div class="nav">
        <router-link :to="link" class="menu link" href="#">
            <div class="fa rightspaced" :class="[hasBack ? 'fa-arrow-left': 'fa-bars']"></div>MY ACCOUNT
        </router-link>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ['hasBack', 'link'],
  data () {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.nav{
    top: 0;
    box-sizing: border-box;
    min-width: 300px;
    width: 100%;
    display: flex;
    position: fixed;
    justify-content: flex-start;
    align-items: center;
    padding: 0 .75em;
    height: 3em;
    background-color: white;
    z-index: 2;
    .menu{
        font-size: 1.2em;
    }
    .right{
        margin-left: auto !important;
    }
    &.blue{
        .link {
            color: $color-blue;
        }
    }
    &.orange{
        .link {
            color: $color-orange;
        }
    }
}

.rightspaced{
    margin-left: .25em;
    margin-right: .75em;
}
.transparent{
    background-color: transparent;
    color: $color-blue;
    border: 1px solid $color-blue;
    &.blue:hover{
        box-shadow: 0 0px 3px $color-blue;
    }
    &.red:hover{
        box-shadow: 0 0px 3px $color-red;
    }
}
</style>
