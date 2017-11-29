<template>
  <div>
    <div class="nav orange">
        <router-link :to="'/shop1'" class="menu link">
            <div class="fa fa-arrow-left rightspaced"></div>DISCARD CHANGES
        </router-link>
    </div>
    <div class="cover" style="color: white;line-height: 200px;opacity:0.5;">Change Brand Image</div>
    <div class="s-detail">
        <h2>Edit Shop</h2>
      <div class="shopform">
        <div class="fa fa-pencil"></div>
        <div class="form group">
          <input required type="text" id="s-name" class="lite" value="" />
          <label for="s-name">Shop Name</label>
        </div>
        <div class="fa fa-pencil-square-o"></div>
        <div class="form group">
          <textarea required type="text" id="s-desc" class="lite" value=""></textarea>
          <label for="s-desc">Shop Description</label>
        </div>
        <div class="fa fa-phone"></div>
        <div class="form group">
          <input required type="text" id="s-phone" class="lite" value="087 654 3210" />
          <label for="s-phone">Shop Phone No.</label>
        </div>
        <div class="fa fa-male"></div>
        <div class="form group">
          <input required type="text" id="s-serv" class="lite" value="" />
          <label for="s-serv">Shop Service Capacity</label>
        </div>
        <div class="fa fa-clock-o"></div>
        <div class="time-group">
          <div class="form group">
            <input required type="time" id="s-timestart" class="lite s-time" value="09:30" />
            <label for="s-time">Shop Queue Open</label>
          </div>
          <div class="form group">
            <input required type="time" id="s-timeend" class="lite s-time" value="19:30" />
            <label for="s-time">Shop Queue Close</label>
          </div>
        </div>
        <div class="fa fa-calendar"></div>
        <div class="form group">
          <div class="day-group">
            <input required type="checkbox" id="s-sunday" class="lite" value="" /><label for="s-sunday">Sun</label>
            <input required type="checkbox" id="s-monday" class="lite" value="" /><label for="s-monday">Mon</label>
            <input required type="checkbox" id="s-tuesday" class="lite" value="" /><label for="s-tuesday">Tue</label>
            <input required type="checkbox" id="s-wednesday" class="lite" value="" /><label for="s-wednesday">Wed</label>
            <input required type="checkbox" id="s-thursday" class="lite" value="" /><label for="s-thursday">Thu</label>
            <input required type="checkbox" id="s-friday" class="lite" value="" /><label for="s-friday">Fri</label>
            <input required type="checkbox" id="s-saturday" class="lite" value="" /><label for="s-saturday">Sat</label>
          </div>
          <div class="s-day">Shop Service Days</div>
        </div>
      </div>
      <div class="column group">
        <a @click="CommitSave" class="wide orange button">Confirm Changes</a>
      </div>
    </div>
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
    CommitSave: function() {
      // console.log("Hey")
      this.commitSave = true;
      this.$router.push('/shop1')
    }
  },
  beforeRouteLeave (to, from, next){
    if (this.commitSave) { next(); }
    else {
      var confirm = window.confirm('Discard changes and return to shop page?');
      if (confirm){
        next();
      } else {
        next(false);
      }
    }
  },
  data() {
    return{
      commitSave: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/variable";
.cover{
  width: 100%;
  min-height: 200px;
  background-color: $color-orange85;
  cursor: pointer;
  transition: opacity .3s;
  &:hover{
    opacity: $opacity-link !important;
  }
}
.time-group{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  input {
    width: 100% !important;
  }
}
.day-group{
  display: flex;
}
.s-detail{
  width: -webkit-fill-available;
  max-width: 500px;
  padding: 0 1em;
  padding-bottom: 1em;
}
.shopform{
    display: grid;
    grid-template-columns: 1em auto;
    grid-template-areas: "glyph form";
    grid-template-rows: auto;
    align-items: center;
    grid-gap: .25rem;
    .fa-pencil-square-o{
      line-height: 3.5em;
      align-self: baseline;
    }
    .wide.button{
        grid-column: 2 span;
    }
}
.group.form{
    display: grid;
    grid-template-columns: 1fr max-content;
    position: relative;
    text-align: left;
}

textarea{
  border: none;
  box-shadow: 0 1px $color-grey50;
  resize: vertical;
  font-family: 'Kanit', sans-serif;
  font-weight: $font-normal;
  font-size: 1em;
  transition: all .15s;
  outline: none;
  min-height: 7.5em;
  &:focus{
    box-shadow: 0 2px $color-orange50;
  }
  &:focus + label, &:valid + label{
      font-size: .8em;
      top: -1.25em;
      color: $color-orange;
  }
}
input.lite{
  width: -webkit-fill-available;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 1px $color-grey50;
  outline: none;
  color: $color-grey;
  font-family: 'Kanit', sans-serif;
  font-weight: $font-normal;
  font-size: 1em;
  transition: all .15s;
  &:focus, &:valid{
    box-shadow: 0 2px $color-orange50;
  }
  &:focus + label, &:valid + label{
    font-size: .8em;
    top: -1.25em;
    color: $color-orange;
  }
}

input[type=checkbox].lite {
  display: none !important;
  & + label{
    border-radius: 5px;
    border: 1px solid $color-orange;
    color: $color-orange;
    display: inline-block;
    line-height: 3rem;
    text-align: center;
    width: 2.125rem;
    position: unset;
    margin: .75rem .125rem;
  }
  &:focus + label, &:valid + label{
    font-size: 1.1em;
    top: unset;
    color: white;
    background-color: $color-orange;
    border-color: transparent;
  }
}

input.s-time{
    font-size: 1.6em;
}

.s-day{
    display: block;
    position: absolute;
    color: $color-orange;
    font-size: .8em;
    top: -1.25em;
}

label{
    display: block;
    position: absolute;
    color: $color-grey;
    transition: all .15s;
    top: 0em;
}
</style>
