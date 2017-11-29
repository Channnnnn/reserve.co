<template>
  <div>
    <div v-if="!auth" class="ghost nav">
      <vButton :link="'/login'" class="mini transparent button right">Login</vButton>
    </div>
    <div v-if="!owner && auth" class="nav"><!-- Show this instead if not owner -->
      <router-link :to="'/account'" class="menu link">
        <div class="fa fa-arrow-left rightspaced"></div>MY ACCOUNT
      </router-link>
    </div>
    <div v-if="owner && auth" class="nav orange"><!-- Show this if shop owner -->
      <a class="menu link" @click="toggleAside">
          <div class="fa fa-bars rightspaced"></div>MY SHOP
      </a>
      <vButton :link="'/account'" class="mini orange transparent button right">Switch to Account</vButton>
    </div>
    <div class="cover"></div>
    <div class="s-detail">
      <h2>Shop Name</h2>
      <div>
        <div class="lite multiline">
          <div class="fa fa-pencil-square-o" aria-hidden="true"></div>{{s}}</div>
        <div class="lite">
          <div class="fa fa-clock-o"></div>9:30 - 21:30 · Mon-Fri
          <div class="right bubble pointleft opening"></div>
        </div>
        <div class="lite">
          <div class="fa fa-phone"></div>087 654 3210</div>
      </div>
      <div class="column-group">
        <a v-if="!owner" class="huge wide green button">Book Reservation</a>
        <vButton v-if="owner" :link="'/managequeue'" class="huge wide green button">Manage Reservation</vButton>
        <vButton v-if="owner" :link="'/editshop'" class="orange transparent button link">Edit Shop Info</vButton>
      </div>
      <div class="rounded row group urlinfo">
        <a class="copy button">Copy URL</a>
        <input class="shopurl" type="text" value="https://reserve.co/shopURL" readonly="readonly" />
      </div>
    </div>
    <transition name="slide">
    <div class="aside" v-if="showAside">
      <a class="menu link" @click="toggleAside">
        <div class="fa fa-arrow-left rightspaced"></div>SHOP NAME BLAH BLAH BLAH
      </a>
      <router-link :to="'/editshop'" class="list link orange">Edit Shop Info</router-link>
      <router-link :to="'/account'" class="list button blue transparent">Return to Account</router-link>
      <span class="mini divider"></span>
      <div class="list header">Shop list</div>
      <router-link :to="'/shop2'" @click.native="closeAside" class="list link orange">Shop 1</router-link>
      <!-- <span class="mini divider"></span> -->
      <!-- <router-link :to="'/account'" class="list link blue">Return to Account</router-link> -->
      <div class="aside-hide" @mousedown.left="closeAside"></div>
    </div>
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/navigationbar.vue'
import vButton from "@/components/button.vue"
export default {
  components: {
    Navbar,
    vButton
  },
  methods: {
    toggleAside: function() {
      this.showAside = !this.showAside;
    },
    closeAside: function(){
      this.showAside = false;
    },
  },
  data() {
    return{
      auth: true,
      owner: false,
      s: 'Shop descriptions',
      showAside: false
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.cover{
  width: 100%;
  min-height: 200px;
  background-color: $color-orange85;
}
.s-detail{
  width: -webkit-fill-available;
  max-width: 500px;
  padding: 0 1em;
  padding-bottom: 1em;
}
.lite{
  display: flex;
  text-align: left;
  &.multiline{
    white-space: pre-line;
  }
  .fa{
    width: 1.5em;
    align-self: flex-start;
    line-height: 1.5em;
  }
  .right{
    margin-left: auto; 
  }
  .bubble{
    color: white !important;
    font-size: .85em;
    border-radius: 5px;
    padding: 0 .49em;
    height: 1.62em;
    &.pointleft:before {
      content: "";
      z-index: 0;
      position: absolute;
      height: .5em;
      width: .5em;
      border-top: none;
      border-right: none;
      transform: translate(-.75em,.5em) rotate(45deg);
    }
    &.opening{
      border: 1px solid $color-green;
      background-color: $color-green;
    }
    &.opening:before{
      background-color: $color-green;
      border: 1px solid $color-green;
    }
    &.opening:after{
      content: "Opening";
    }
    &.closing{
      border: 1px solid $color-red;
      background-color: $color-red;
    }
    &.closing:before{
      background-color: $color-red;
      border: 1px solid $color-red;
    }
    &.closing:after{
      content: "Closing";
    }
  }
}
.column-group{
  display: grid;
  grid-template-columns: auto;
  grid-gap: .75em;
  margin: .75em 0;
  * {
    margin: 0 !important;
  }
  .huge{
    font-size: 1.5em;
    font-weight: $font-bold;
    margin: .5em 0 .5em 0;
    &.green{
      background-color: $color-green;
    }
  }
}
.urlinfo{
  width: min-content;
  margin: auto;
  border-radius: 6px;
  .copy{
    margin: 0;
    width: max-content;
    min-width: unset;
    background-color: $color-orange;
    font-weight: $font-bold;
    font-size: .9em;
    line-height: 2rem;
    padding: 0 .5rem;
    cursor: pointer;
  }
  *:first-child{
    border-radius: 6px 0 0 6px;
  }
  *:last-child{
    border-radius: 0 6px 6px 0;
  }
}
.shopurl{
    min-width: 200px;
    border: none;
    color: $color-orange !important;
    background-color: $color-orange10;
    box-shadow: 0 0 1px $color-orange inset;
    font-size: .8em !important;
    font-family: 'Kanit' !important;
    font-weight: $font-normal;
    line-height: 2rem;
    padding: 0 .25rem;
    cursor: text;
}
.shopurl:focus{
    box-shadow: inset 0 0 3px $color-blue;
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
  // background-color: rgba(64,64,64,0.9);
  // color: white;
  box-shadow: 0 0 12px $color-grey;
  width: 275px;
  height: 100%;
  text-align: left;
  padding: 0 .75em;
  box-sizing: border-box;
  font-size: 1.2rem;
  .button{
    font-size: 1.2rem;
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
    color: $color-orange;
    &.blue{
      color: $color-blue;
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
.aside-hide{
  content: "";
  width: calc(100vw - 275px);
  height: 100%;
  position: absolute;
  left: 275px;
  // background-color: $color-grey10;
}
</style>

