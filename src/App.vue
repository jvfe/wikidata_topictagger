<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h1>topictagger</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="#" target="_blank" text>
        <span class="mr-2">Source Code</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
  })
};
</script>
