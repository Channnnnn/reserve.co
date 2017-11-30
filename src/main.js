import Vue from 'vue'
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/routes/routes'
// import BodyParser from 'body-parser' 

Vue.use(VueRouter);
// Vue.use(BodyParser.json());

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
