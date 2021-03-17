<template>
  <v-sheet color="accent lighten-4" elevation="10" rounded class="pa-2">
    <v-col>
      <p v-if="term" class="body-2">
        Obtaining up to 300 articles about {{ term.label }} that don't have
        <a
          :href="`http://www.wikidata.org/entity/${term.id}`"
          target="_blank"
          >{{ term.id }}</a
        >
        as a main subject
      </p>
      <v-btn @click="copyCommands" color="primary" class="ma-2">
        <v-icon small>mdi-clipboard-outline</v-icon>
        Copy
      </v-btn>
      <v-btn
        color="warning"
        href="https://quickstatements.toolforge.org/#/batch"
        target="_blank"
        class="ma-2"
      >
        <v-icon small>mdi-arrow-top-right</v-icon>
        Go to Quickstatements
      </v-btn>
      <v-textarea
        outlined
        readonly
        height="100%"
        :loading="loadingQS"
        class="quickstatements mt-1"
        label="Quickstatements"
        :value="quickstatements"
        id="qsArea"
      ></v-textarea>
    </v-col>
  </v-sheet>
</template>

<script>
import { querySPARQLService } from "../lib/API";

export default {
  name: "QSBox",
  props: ["term"],
  data: () => ({
    quickstatements: "",
    loadingQS: false
  }),

  watch: {
    term(val) {
      if (val != null) {
        this.fetchQuery();
      } else {
        this.quickstatements = "";
      }
    }
  },

  methods: {
    fetchQuery: async function() {
      this.loadingQS = true;
      const queryResult = await querySPARQLService(
        this.term.id,
        this.term.label
      );
      this.quickstatements =
        queryResult == "" ? "Couldn't find any articles 😥" : queryResult;
      this.loadingQS = false;
    },
    copyCommands: function() {
      const qsAreaElement = document.querySelector("#qsArea");
      qsAreaElement.select();
      document.execCommand("copy");
    }
  }
};
</script>

<style scoped>
.quickstatements {
  font-family: monospace;
}
</style>
