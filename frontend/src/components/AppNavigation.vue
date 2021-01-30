<template>
  <span>
    <!--
    <v-navigation-drawer app v-model="drawer" class="light-blue" dark disable-resize-watcher>
      <v-list>
        <template v-for="(item, index) in items">
          <v-list-item tile :key="index">
            <v-list-item-content tile>{{item.title}}</v-list-item-content>
          </v-list-item>
          <v-divider :key="`divider-${index}`"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>-->
    <v-app-bar color="teal lighten-1" dark>
      <!--
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      -->
      <router-link to="/">
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <v-btn v-if="!$store.getters.user_authenticated" text to="/login"
        >Ingresar</v-btn
      >

      <v-btn text to="/about">Acerca de</v-btn>

      <!-- <v-btn v-if="!user.authenticated" text-to="/signup">Sign Up</v-btn> -->
      <!-- <v-btn v-if="$store.getters.user_authenticated" text to="/iniciales/"
        >Saldos Iniciales</v-btn
      >      -->

      <v-btn v-if="$store.getters.user_authenticated" text @click="logout()"
        >Salir</v-btn
      >

      <v-spacer></v-spacer>
      <!--
      <v-btn text to="/singin">SIGN IN</v-btn>
      <v-btn color="brown lighten-3" to="/join">JOIN</v-btn>
      -->
    </v-app-bar>
  </span>
</template>

<script>
//import auth from "../auth";

export default {
  name: "AppNavigation",
  data() {
    return {
      appTitle: "Vue.js Login Example",
      drawer: false,
      items: [{ title: "Menu" }, { title: "Sign In" }, { title: "Join" }],
    };
  },
  methods: {
    logout() {
      console.log("logout Method");
      console.log("DEBUG=" + this.$store.getters.user_authenticated);
      this.$store.dispatch("remove_token");
      this.$router.push("login");
    },
  },
};
</script>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>