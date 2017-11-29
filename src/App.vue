<template>
  <div id="app">
    <router-view :data="data"  class="container"></router-view>
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
              status: 'accepted',
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
              status: 'accepted',
              detail: ''
          },
          {
              id: 2312,
              number: 10,
              shopName: 'Shop86',
              status: 'canceled',
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
              status: 'accepted',
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
              status: 'accepted',
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
              status: 'accepted',
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
    font-weight: $font-bold;
    margin: 0.5em 0;
}
h3{
    font-size: 1.25em;
    font-weight: $font-normal;
    margin: .5em 0;
}
h4{
    font-weight: $font-bold;
    margin: .5em 0;
}
h5{
    font-weight: $font-normal;
    margin: .5em 0;
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
  color: $color-blue;
  text-decoration: none;
}

a.button{
  border-radius: 5px;
  box-sizing: border-box;
  padding: .56em 1em;
  font-size: 1.1em;
  line-height: 1em;
  color: white;
  background-color: $color-blue;
  border: 1px solid transparent;
  opacity: .85;
  &:hover{
    opacity: 1;
  }
  &.green{
    background-color: $color-green !important;
  }
  &.orange{
    background-color: $color-orange !important;
  }
  &.transparent{
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
}
a.link:hover, a.button:hover, input[type=checkbox].lite + label:hover{
    opacity: 1;
}
/* 
 *  TAB COMPONENTS
*/
a.tab{
    width: -webkit-fill-available;
    line-height: 2.25em;
    transition: all .15s;
    &::after{
        content: "";
        display: block;
        height: 5px;
        width: auto;
        background-color: transparent;
        transition: all .15s;
    }
    &:hover::after{
        background-color: $color-blue10;
    }
    &.active::after{
        background-color: $color-blue85;
    }
    &.active:hover{
        filter: none;
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

.container{
    min-width: 320px;
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: flex-start;
    align-items: center;
    height: 100vh;
    font-family: 'Kanit', sans-serif;
    font-weight: $font-normal;
    text-align: center;
}

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
    &.ghost{
        position: absolute;
        background-color: transparent;
        .button.transparent{
            border-color: white !important;
            border-width: 2px !important;
            color: white !important;
            font-weight: $font-bold;
            text-transform: uppercase;
            &:hover{
                border: 2px solid white !important;
                background-color: white !important;
                color: $color-blue85 !important;
                filter: none !important;
            }
        }
    }
    .menu{
        font-size: 1.2em;
        user-select: none;
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

.nav + *{
  margin-top: 3em !important;
}
.nav.ghost + *{
    margin-top: 0 !important;
}
.panel + *{
  margin-top: 17em !important;
}
.panel.shop + *{
  margin-top: 9.5em !important;
}

/* SPACERS */
span.divider{
    display: block;
    height: 1px;
    background-color: $color-grey50;
    margin: 1em 0 1em 0;
}
span.mini.divider{
    margin: .5em 0 .5em 0 !important; 
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

.section{
    margin: 1em auto 1em auto;
}

.before-after-space{
    margin: 1em auto !important;
}


/* GROUP PROPERTIES : for button & forms */
.group{
    display: flex;
    margin: 1em 0;
    &.tab{
        margin: 0;
    }
    &.buttons{
        margin: 1em calc($gutter * (-1)) !important;
    }
    &.row{
        flex-direction: row;
    }
    &.column{
        flex-direction: column;
    }
}
</style>
