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
      <v-col>
        <v-autocomplete
          v-model="term"
          :loading="loadingComplete"
          :search-input.sync="search"
          :items="terms"
          chips
          deletable-chips
          hint="Start typing to search for a topic"
          hide-no-data
          hide-selected
          no-filter
          color="blue-grey lighten-2"
          label="Search for a topic"
          item-text="id"
          prepend-icon="mdi-magnify"
          solo
          return-object
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>{{
                `${item.label} (${item.id})`
              }}</v-list-item-title>
              <v-list-item-subtitle
                v-text="item.description"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-sheet elevation="10" rounded>
          <v-col>
            <p v-if="term" class="body-2">
              Obtaining up to 300 articles about {{ term.label }} that do not
              have
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
      </v-col>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import { searchWikibase, querySPARQLService } from "./lib/API";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data() {
    return {
      term: "",
      search: "",
      quickstatements: "",
      terms: [],
      loadingComplete: false,
      loadingQS: false
    };
  },

  watch: {
    term(val) {
      if (val != null) {
        this.fetchQuery();
      } else {
        this.quickstatements = "";
      }
    },
    search(val) {
      if (!val) return;

      this.searchTerm(val);
    }
  },
  methods: {
    searchTerm: function(val) {
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.fetch(val);
      }, 800);
    },
    fetch: async function(val) {
      this.loadingComplete = true;
      this.terms = await searchWikibase(val);
      this.loadingComplete = false;
    },
    fetchQuery: async function() {
      this.loadingQS = true;
      const queryResult = await querySPARQLService(
        this.term.id,
        this.term.label
      );
      this.quickstatements = queryResult;
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
