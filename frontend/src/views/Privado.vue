<template>
  <div id="bienvenida">
    <span v-if="$store.getters.user_authenticated">
      <h1>Bienvenido al área privada de Vue.js Login</h1>
    </span>

    <p>
      {{ autenticado }}

      <br />
    </p>

    <p>
      {{ datos_recibidos }}
    </p>

    <span v-if="!$store.getters.user_authenticated">
      <h1>
        Usted no está autorizado a ingresar al área privada de Vue.js Login
      </h1>

      <p>Por favor, ingrese con su usuario y contraseña.</p>
    </span>
  </div>
</template>

<script>
import { API_URL } from "../main";

export default {
  name: "Home",
  pops: ["app_name"],
  data() {
    return {
      codigo: this.$route.params.codigo,
      datos_recibidos: [],
    };
  },
  computed: {
    autenticado() {
      return "DEBUG autenticado=" + this.$store.getters.user_authenticated;
    },
  }, // fin de computed
  created() {
    //console.log("DEBUG Privado created")
    var autenticado = !this.$store.getters.user_authenticated;
    //console.log("autenticado=", autenticado);
    if (autenticado) this.$router.push("/login");
    var server_url = API_URL + "message?";
    fetch(server_url, {
      headers: this.$store.getters.AuthHeaders,
    })
      .then((res) => res.json())
      .then((datos) => {
        this.datos_recibidos = datos;
        console.log("DEBUG datos_recibidos=", JSON.stringify(datos));
      })
      .catch((error) => {
        console.log(error);
      });
  }, // fin de created
}; // fin de methods
</script>


<style scoped>
h1,
p {
  text-align: center;
}

div {
  padding-left: 80px;
}
</style>