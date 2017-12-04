import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/routes/routes'
import {getCurrentUser,
  getUserReservation,
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
  reducer: state => state
  // reducer: state => ({
  //   loggedInAs: state.loggedInAs,
  //   userData: state.userData,
  //   userAvatar: state.userAvatar,
  //   // userReservations: state.userReservations,
  //   // currentShopData: state.currentShopData,
  // }),
  // filter: mutation => (mutation.type == 'onAuthChanged')
})

const store = new Vuex.Store({
  state: {
    loading: false,
    loggedInAs: null,
    redirectPath: null,
    userData: null,
    userAvatar: null,
    userReservations: [],
    currentShopData: null,
    currentQueueData: null,
    currentQueueUserData: null,
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
    UserAvatar: state => {
      return state.userAvatar
    },
    GetRedirectPath: state => {
      return state.redirectPath
    },
    GetUserReservation: state => {
      return state.userReservations
    },
    CurrentShopData: state => {
      return state.currentShopData
    },
    CurrentQueueData: state => {
      return state.currentQueueData
    },
    CurrentQueueUserData: state => {
      return state.currentQueueUserData
    }
  },

  actions: {
    onLoadingAsync({commit}, payload){
      commit('onLoadingAsync', {loadStatus: payload})
    },
    setRedirect({commit}, payload){
      commit('setRedirect', {fullpath : payload})
    },
    completedRedirect({commit}){
      commit('clearRedirect')
    },
    //**** USER ****//
    onAuthChanged({commit}){
      commit('onAuthChanged')
    },
    onFetchUser({commit}){
      commit('onAuthChanged')
    },
    onSignOut({commit}){
      commit('onSignOut')
    },
    onSyncAvatar({commit}, payload){
      commit('syncUserAvatar', payload)
    },
    onSyncUserData({commit}, payload){
      commit('syncUserData', payload)
    },
    onSyncAllReservations({commit}, payload){
      commit('syncUserReservations', {reservations: payload})
    },
    /**********/
    //
    //
    //**** SHOP ****//
    onFetchCurrentShopData({commit}, payload){
      commit('fetchCurrentShopData', payload)
    },
    /**********/
    //
    //
    //**** QUEUE ****//
    onFetchCurrentQueueData({commit}, payload){
      commit('fetchCurrentQueueData', payload)
    },
    onFetchCurrentQueueUserData({commit}, payload){
      commit('fetchCurrentQueueUserData', payload)
    }
  },
  mutations: {
    onLoadingAsync(state, payload){
      state.loading = payload.loadStatus;
    },
    onAuthChanged(state){
      state.loggedInAs = getCurrentUser();
    },
    onSignOut(state) {
      state.userData = null;
      state.userAvatar = null;
      state.userReservations = null;
    },
    setRedirect(state, payload){
      state.redirectPath = payload.fullpath;
    },
    clearRedirect(state){
      state.redirectPath = null;
    },
    syncUserData(state, payload){
      state.userData = payload;
    },
    syncUserAvatar(state, payload){
      state.userAvatar = payload;
    },
    syncUserReservations(state, payload){
      state.userReservations = payload.reservations;
    },
    fetchCurrentShopData(state, payload){
      state.currentShopData = payload;
    },
    fetchCurrentQueueData(state, payload){
      state.currentQueueData = payload;
    },
    fetchCurrentQueueUserData(state, payload){
      state.currentQueueUserData = payload;
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
    next();
  }
});
