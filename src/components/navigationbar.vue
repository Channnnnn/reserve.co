<template>
    <div class="nav">
        <a class="blue menu link" href="#">
            <div class="fa fa-bars rightspaced"></div>MY ACCOUNT
        </a>
        <vButton v-if="$route.name == 'account'" class="mini blue transparent button right" href="#">Manage Shop</vButton>
    </div>
</template>

<script>
import vButton from "@/components/button.vue"
export default {
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
a.link:hover, a.button:hover{
    opacity: 1;
}
.blue, .blue.link {
    color: $color-blue;
}
.rightspaced{
    margin-left: .25em;
    margin-right: .75em;
}
</style>
