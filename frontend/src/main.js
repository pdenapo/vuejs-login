import Vue from 'vue'
import VueRouter from 'vue-router';

export const SERVER_URL = 'http://192.168.0.100:8082'
export const API_URL = 'http://192.168.0.100:8082/api/'

Vue.config.devtools = true
Vue.config.productionTip = false;

import Vuex from 'vuex'
Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    token: null
  },
  mutations: {
    set_token(state, token) {
      console.log("Mutation set_token token=", token)
      state.token = token;
      localStorage.setItem('AuthToken', token);
    }
  },
  getters: {
    user_authenticated: state => {
      let result = state.token != null
      //console.log("getter user_authenticated result=", result)
      return result
    },
    AuthHeaders: state => {
      return {
        'AuthToken': state.token
      }
    }
  },
  actions: {
    async getToken(context, creds) {
      /// console.log("Action getToken creds=", creds)
      //console.log("We get data from " + API_URL + 'sign_in')
      let response = await fetch(API_URL + 'sign_in', {
        method: 'POST',
        headers: {
          'username': creds.username,
          'password': creds.password
        }
      })


      if (await response.status == 200) {
        let data = await response.json();
        context.commit('set_token', data.AuthToken);
      }
      else
        context.commit('set_token', null);
    },
    remove_token(context) {
      localStorage.removeItem("AuthToken");
      context.commit("set_token", null);
    },
    checkAuth(context) {
      var jwt = localStorage.getItem('AuthToken')
      if (jwt)
        context.commit('set_token', jwt)

    }
  }
})

// Check the user's auth status when the app starts
//store.dispatch("checkAuth")

store.dispatch("remove_token")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: () => {
      if (store.getters.user_authenticated)
        return ("/privado")
      else
        return ("/login")
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/privado',
    name: 'privado',
    component: () => import('./views/Privado.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/About.vue')
  }
]

const router = new VueRouter({
  routes
})


import vuetify from "./plugins/vuetify";

import App from './App.vue'
// import "@babel/polyfill";


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')


