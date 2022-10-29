<template>
  <span>
    <v-app-bar color="teal lighten-1" dark>
      <router-link to="/">
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <v-btn v-if="!$store.getters.user_authenticated" text to="/login"
        >Ingresar</v-btn
      >

      <v-btn text to="/about">Acerca de</v-btn>

      <v-btn v-if="$store.getters.user_authenticated" text @click="logout()"
        >Salir</v-btn
      >

      <v-spacer></v-spacer>
    </v-app-bar>
  </span>
</template>

<script>
export default {
  name: "AppNavigation",
  props: ["app_name"],
  data() {
    return {
      appTitle: this.app_name,
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