import Vue from 'vue'
// import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';
import { store } from '@/scripts/store_config'
import App from '@/App.vue'
import VueRouter from 'vue-router'
import {auth} from '@/scripts/firebase_config'
import routes from '@/routes/routes'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: routes
});
window.App = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  created(){
    store.dispatch('onAuthChanged');
  }
})
router.beforeEach((to,from, next) => {
  // console.log(to);
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('req Auth');
    if (store.getters.HasAuth){
      console.log('has Auth');
      next();
    }
    else{
      console.log('has no Auth');
      var confirm = window.confirm("Login is required, do you wish to proceed?");
      if (confirm){
        if (!store.getters.GetRedirectPath && !(from.name == 'login')){
          // console.log('has redirect:' + !store.getters.GetRedirectPath);
          // console.log('from login:' + !(from.name == 'login'));
          store.dispatch('setRedirect', to.fullPath);
        }
        console.log('go login');
        next({
          name: 'login', 
        });
      } else {
        next(false);
      }
    }
  }
  else {
    next();
  }
});

