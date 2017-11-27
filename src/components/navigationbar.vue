<template>
    <div class="nav">
        <a class="blue menu link" href="accountsetting.html">
            <div class="fa fa-bars rightspaced"></div>MY ACCOUNT
        </a>
        <Button class="mini blue transparent button right" :data="test"></Button>
    </div>
</template>

<script>
import Button from "@/components/button.vue"
export default {
  data () {
    return {
      test: {
        link: 'manageshop.html',
        name: 'Manage Shop'
      }
    }
  },
  components: {
    Button
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.nav{
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
