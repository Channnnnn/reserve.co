import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import {auth} from '@/scripts/firebase_config'

Vue.use(Vuex);

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
  
export const store = new Vuex.Store({
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
            state.loggedInAs = auth.currentUser;
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