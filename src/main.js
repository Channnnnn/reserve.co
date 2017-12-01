import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/routes/routes'
import {getCurrentUser,
  getUserReservation,
  getUserInfo,
  } from '@/scripts/api'
// import BodyParser from 'body-parser' 



Vue.use(VueRouter);
Vue.use(Vuex);
// Vue.use(BodyParser.json());

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({
    loggedInAs: state.loggedInAs,
  }),
  // filter: mutation => (mutation.type == 'onAuthChanged')
})

const store = new Vuex.Store({
  state: {
    loading: false,
    loggedInAs: null,
    redirectPath: null,
    userData: null,
    userReservations: [],
  },

  getters: {
    isLoading: state => {
      return state.loading
    },
    HasAuth: state => {
      return state.loggedInAs
    },
    UserData: state => {
      return state.userData
    },
    GetRedirectPath: state => {
      return state.redirectPath
    },
    GetUserReservation: state => {
      return state.userReservations
    }
  },

  actions: {
    onLoadingAsync({commit}, payload){
      commit('onLoadingAsync', {loadStatus: payload})
    },
    onAuthChanged({commit}){
      commit('onAuthChanged')
    },
    setRedirect({commit}, payload){
      commit('setRedirect', {fullpath : payload})
    },
    completedRedirect({commit}){
      commit('clearRedirect')
    },
    onSyncAllReservations({commit}, payload){
      commit('syncUserReservations', {reservations: payload})
    }
  },
  mutations: {
    onLoadingAsync(state, payload){
      state.loading = payload.loadStatus;
    },
    onAuthChanged(state){
      state.loggedInAs = getCurrentUser();
      if (state.loggedInAs) {
        state.userData = getUserInfo();
      }
    },
    setRedirect(state, payload){
      state.redirectPath = payload.fullpath;
    },
    clearRedirect(state){
      state.redirectPath = null;
    },
    syncUserReservations(state, payload){
      state.userReservations = payload.reservations;
    }
  },
  plugins: [vuexLocalStorage.plugin]
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
  console.log(to.name);
  if (to.name == 'account' && store.getters.HasAuth){
    console.log(getUserReservation("", (result) => {console.log(result)}));
  }
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
          console.log('has redirect:' + !store.getters.GetRedirectPath);
          console.log('from login:' + !(from.name == 'login'));
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
    console.log('no Auth');
    next();
  }
});
