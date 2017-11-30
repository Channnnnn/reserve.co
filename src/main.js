import Vue from 'vue'
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/routes/routes'
import {getCurrentUser} from '@/scripts/api'
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

router.beforeEach((to,from, next) => {
  if (to.matched.some(record=>{record.meta.requiresAuth})){
    if (getCurrentUser()){
      alert('has User');
    }
    else{
      alert('please login');
    }
  }
  // if(this.currentUser == null){
  //   next({name: 'session'});
  // }
  // else {
  //   next();
  // }
});
