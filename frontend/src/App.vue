<template>
  <v-app>
    <app-navigation></app-navigation>
    <v-main transition="slide-x-transition">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppNavigation from "@/components/AppNavigation";
export default {
  name: "App",
  components: {
    AppNavigation
  }
};
</script>

<style>
.dólares {
  color: green;
  float: right;
}

.pesos {
  color: blue;
  float: right;
}

.cuotas {
  color: brown;
  float: right;
}

.color_dólares {
  color: green;
}

.color_pesos {
  color: blue;
}

.color_cuotas {
  color: brown;
}


.orden {
  color: magenta;
}

</style>
