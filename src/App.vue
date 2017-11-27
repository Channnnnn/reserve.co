<template>
  <div id="app">
    <Navbar v-if="$route.path != '/login'"></Navbar>
    <router-view :data="data"></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
export default {
  name: 'app',
  components: {
    Navbar,
  },
  data () {
    return {
      data:{
        queues:[
          {
              id: 123123,
              number: 27,
              shopName: 'Shop27',
              status: 'waiting',
              detail: ''
          },
          {
              id: 1231,
              number: 14,
              shopName: 'Shop8',
              status: 'ready',
              detail: ''
          },
          {
              id: 13123,
              number: 10,
              shopName: 'Shop86',
              status: 'expired',
              detail: ''
          },
          {
              id: 23123,
              number: 27,
              shopName: 'Shop27',
              status: 'waiting',
              detail: ''
          },
          {
              id: 1223,
              number: 14,
              shopName: 'Shop8',
              status: 'ready',
              detail: ''
          },
          {
              id: 2312,
              number: 10,
              shopName: 'Shop86',
              status: 'expired',
              detail: ''
          },
          {
              id: 183123,
              number: 27,
              shopName: 'Shop27',
              status: 'waiting',
              detail: ''
          },
          {
              id: 523123,
              number: 14,
              shopName: 'Shop8',
              status: 'ready',
              detail: ''
          },
          {
              id: 13,
              number: 10,
              shopName: 'Shop86',
              status: 'expired',
              detail: ''
          },
          {
              id: 2323,
              number: 27,
              shopName: 'Shop27',
              status: 'waiting',
              detail: ''
          },
          {
              id: 23,
              number: 14,
              shopName: 'Shop8',
              status: 'ready',
              detail: ''
          },
          {
              id: 32,
              number: 10,
              shopName: 'Shop86',
              status: 'expired',
              detail: ''
          },
          {
              id: 17823,
              number: 27,
              shopName: 'Shop27',
              status: 'waiting',
              detail: ''
          },
          {
              id: 903123,
              number: 14,
              shopName: 'Shop8',
              status: 'ready',
              detail: ''
          },
          {
              id: 113123,
              number: 10,
              shopName: 'Shop86',
              status: 'expired',
              detail: ''
          },
        ]
      }
    }
  },
}
</script>

<style lang="scss">
@import "~@/assets/variable";
$btn-blue: hsl(193, 66%, 45%);
.nav + *{
  margin-top: 3em !important;
}

html,body{
  margin: 0;
}
#app {
  font-family: 'Kanit', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: lighter;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: lighter;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: $btn-blue;
  text-decoration: none;
}

a.button{
  border-radius: 5px;
  box-sizing: border-box;
  padding: .56em 1em;
  font-size: 1.1em;
  line-height: 1em;
  color: white;
  background-color: $btn-blue;
  border: 1px solid transparent;
  opacity: .85;
  &:hover{
    opacity: 1;
  }
  &.transparent{
    background-color: transparent;
    color: $btn-blue;
    border: 1px solid $btn-blue;
    box-shadow: .5px 0 0 $btn-blue, -.5px 0 0 $btn-blue,
      0 .5px 0 $btn-blue, 0 -.5px 0 $btn-blue;
  }
}

.invisible{
    visibility: hidden;
}

div.fa{
    text-align: center;
    vertical-align: middle;
}
.link .fa {
    vertical-align: unset;
}

a { 
    cursor: pointer;
    transition: all .15s;
    text-decoration: none;
    .link{
        opacity: $opacity-link;
    }
    .disabled, .disabled:hover{
        opacity: .1;
        cursor: unset;
    }
}

li.lite{
    display: flex;
    flex-direction: row;
    align-items: center;
    list-style: none;
    text-align: left;
    &.em{
        font-size: 1.5em;
    }
}

div.divider {
    overflow: hidden;
    text-align: center;
    color: $color-grey;
    font-size: .75em;
    &.big {
        font-size: unset;
    }
    &::before, &::after {
        display: inline-block;
        content: "";
        height: 1px;
        position: relative;
        vertical-align: middle;
        width: 50%;
        background-color: $color-grey50;
    }
    &::before {
        right: .5em;
        margin-left: -50%;
    }
    &::after {
        left: .5em;
        margin-right: -50%;
    }
}
</style>
