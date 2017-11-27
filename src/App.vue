<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
}
</script>

<style lang="scss">
$btn-blue: hsl(193, 66%, 45%);

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
  cursor: pointer;
  transition: all .15s;
  text-decoration: none;
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
</style>
