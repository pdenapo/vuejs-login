<template>
  <v-app id="inspire">
    <h1>Bienvenido a Viewjs.Login - Versión 0.1</h1>
    <h2 v-if="intentos == 0">Por favor identifíquese para Ingresar</h2>
    <h2 v-if="intentos > 0" id="failed">
      Usario o contraseña incorrectos. Por favor, inténtelo nuevamente.
      (Intentos: {{ intentos }})
    </h2>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Ingresar a Luca Web</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Nombre de Usuario"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="credentials.username"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="credentials.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="submit()">Entrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
//import auth from "../auth";
//import { accessSync } from "fs";

export default {
  data: function () {
    return {
      credentials: {
        username: "",
        password: "",
      },
      intentos: 0,
    };
  },
  methods: {
    submit() {
      console.log("submit method");

      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password,
      };

      this.$store.dispatch("getToken", credentials).then(() => {
        console.log("DEBUG=", this.$store.getters.user_authenticated);
        if (this.$store.getters.user_authenticated) {
          this.intentos = 0;
          this.$router.push("privado");
        } else this.intentos++;
      });
    },
  },
};
</script>

<style scoped>
h1,
h2 {
  text-align: center;
}
#failed {
  color: red;
}
</style>