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
          filled
          hide-no-data
          hide-details
          hide-selected
          no-filter
          color="blue-grey lighten-2"
          label="Search for a topic"
          item-text="id"
          item-value="id"
          append-icon="mdi-magnify"
          solo
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
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import searchWikibase from "./lib/API";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data() {
    return {
      term: "",
      search: "",
      terms: [],
      loadingComplete: false,
      tab: null
    };
  },

  watch: {
    term(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
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
      }, 1000);
    },
    fetch: async function(val) {
      this.loadingComplete = true;
      this.terms = await searchWikibase(val);
      this.loadingComplete = false;
    }
  }
};
</script>
