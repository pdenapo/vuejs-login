import Vue from 'vue'
import VueRouter from 'vue-router';

// Leemos el archivo JSON de configuración
import * as config from '../../config.json';
console.log("config=", config)
const SERVER_URL = 'http://' + config.server_address + ':' + config.server_port
export const API_URL = `${SERVER_URL}/api/`
export const APP_NAME = config.app_name

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
      localStorage.setItem('Authorization', token);
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
        'Authorization': state.token
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
        console.log("data=", data)
        context.commit('set_token', data.Authorization);
      }
      else
        context.commit('set_token', null);
    },
    remove_token(context) {
      localStorage.removeItem("Authorization");
      context.commit("set_token", null);
    },
    checkAuth(context) {
      var jwt = localStorage.getItem('Authorization')
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
    component: () => import('./views/Login.vue'),
    props: APP_NAME
  },
  {
    path: '/privado',
    name: 'privado',
    component: () => import('./views/Privado.vue'),
    props: APP_NAME

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


