<template>
    <div id="app">
        <Loader :loading="loading"></Loader>
        <transition name="fade-half">
        <router-view class="app-div" 
            :class="{'container': $route.name != 'login', 
            'app-div100': $route.name == 'managequeue'}">
        </router-view>
        </transition>
    </div>
</template>

<script>
import {db,auth} from '@/scripts/firebase_config';
import Navbar from '@/components/navigationbar.vue'
import Loader from '@/components/rotateloader.vue';
export default {
    name: 'app',
    components: {
        Navbar,
        Loader
    },
    computed:{
        loading: function(){
            return this.$store.getters.isLoading
        }
    },
    methods: {
    },
}
</script>

<style lang="scss">
@import "~@/assets/variable";
@font-face{
    font-family: 'Kanit';
    font-style: normal;
    font-weight: 300;
    src: url(./assets/Kanit-Light.ttf) format('truetype');
}
@font-face{
    font-family: 'Kanit';
    font-style: bold;
    font-weight: 500;
    src: url(./assets/Kanit-Medium.ttf) format('truetype');
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

.dummy{
    color: transparent;
    background-color: $color-grey10 !important;
    border-radius: 5px;
    &.hidden{
        visibility: hidden;
    }
}

.app-div{
    position: absolute;
    width: 100vw;
    background-color: white;
    overflow-x: hidden;
}
.app-div100{
    width: 100% !important;
}
.v-back{
    left: 50%;
    transform: translateX(-50%) scale(.75);
}
.v-spinner{
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(50%) scale(0.5);
    z-index: 30;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .15s;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}

.fade-half-enter-active, .fade-half-leave-active{
  transition: all .1s;
}

.fade-half-enter, .fade-half-leave-to{
  opacity: 0.25;
//   background-color: rgba(255,255,255,0.25);
}
.fade-half-enter-active,.fade-half-enter-to{
    z-index: 10;
}
.fade-half-leave-active,.fade-half-leave-to{
    z-index: -10;
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
  user-select: none;
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
a.link{
  border-radius: 4px;
  padding: 0 2px;
  transition: background-color .15s;
  user-select: none;
  &.blue:hover{
    background-color: $color-blue10;
  }
  &.red:hover{
    background-color: $color-red10;
  }
  &.orange:hover{
    background-color: $color-orange10;
  }
  &.greed:hover{
    background-color: $color-green10;
  }
}
.orange .link:hover{
  background-color: $color-orange10;
}
.blue .link:hover{
  background-color: $color-blue10;
}
.red .link:hover{
  background-color: $color-red10;
}
.green .link:hover{
  background-color: $color-green10;
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
a.button{
    display: inline-block;
    border-radius: 5px;
    padding: .6em 1em;
    box-sizing: border-box;
    min-width: 150px;
    line-height: 0.9;
    color: white;
    background-color: $color-grey;
    opacity: $opacity-link;
    transition: all .15s;
    &:hover{
        opacity: 1;
    }
    &.blue{
        background-color: $color-blue !important;
    }
    &.red{
        background-color: $color-red !important;
    }
    &.green{
        background-color: $color-green !important;
    }
    &.orange{
        background-color: $color-orange !important;
    }
    &.disabled, &.disabled:hover{
        background-color: $color-grey !important;
        opacity: .25;
        cursor: unset;
    }
    &.transparent{
        border: 1px solid $color-blue !important;
        color: $color-blue !important;
        background-color: transparent !important;
        &:hover{
            filter: brightness(.75) saturate(1.5);
        }
        &.red{
            border-color: $color-red !important;
            color: $color-red !important;
            background-color: transparent !important;
        }
        &.blue{
            border-color: $color-blue !important;
            color: $color-blue !important;
            background-color: transparent !important;
        }
        &.orange{
            border-color: $color-orange !important;
            color: $color-orange !important;
            background-color: transparent !important;
        }
        &.disabled, &.disabled:hover{
            border-color: $color-grey !important;
            color: $color-grey !important;
            background-color: transparent !important;
            opacity: .25;
            cursor: unset;
        }
    }
    &.em{
        font-size: 1.1rem;
    }
    &.wide{
        display: block !important;
    }
    &.micro { /* Single Icon button */
        font-size: inherit;
        height: 2em;
        min-width: 2em;
        margin: 0;
        text-align: center;
        align-self: center;
    }
    &.mini { /* Navbar Button */
        font-size: .8em;
        padding: .5em .75em;
        min-width: 100px;
        & .fa:first-child {
            margin: -.1em .25em 0 0;
        }
    }
    &.huge{
        font-size: 1.5em;
        font-weight: $font-bold;
        margin: .5em 0 .5em 0;
        &.transparent{
            font-weight:  $font-normal;
        }
    }    
}
.fullwidth {
    width: 100% !important;
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
    width: 100vw;
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

.aside-hide{
  @media screen and (max-width: 450px) {
    background-color: rgba(0,0,0,.5);
  }
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  mix-blend-mode: multiply;
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
.panel, .nav{
    left: 0;
}
.panel + *{
  margin-top: 9.5em !important;
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
