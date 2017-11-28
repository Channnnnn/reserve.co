<template>
    <div class="nav">
        <router-link :to="link" class="blue menu link" href="#">
            <div class="fa rightspaced" :class="[hasBack ? 'fa-arrow-left': 'fa-bars']"></div>MY ACCOUNT
        </router-link>
        <vButton v-if="$route.name == 'account'" class="mini blue transparent button right" href="#">Manage Shop</vButton>
    </div>
</template>

<script>
import vButton from "@/components/button.vue"
export default {
    props: ['hasBack', 'link'],
  data () {
    return {
    }
  },
  components: {
    vButton
  }
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
    z-index: 1;
    .menu{
        font-size: 1.2em;
    }
    .right{
        margin-left: auto !important;
    }
}

.blue, .blue.link {
    color: $color-blue;
}
.rightspaced{
    margin-left: .25em;
    margin-right: .75em;
}
.transparent{
    background-color: transparent;
    color: $color-blue;
    border: 1px solid $color-blue;
    &:hover{
        box-shadow: 0 0px 3px $color-blue;
    }
}
</style>
