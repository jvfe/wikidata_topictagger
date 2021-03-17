<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h1>topictagger</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/jvfe/wikidata_topictagger"
        target="_blank"
        text
      >
        <span class="mr-2">Source Code</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-row class="justify-center pa-4">
        <v-col xs="12" lg="6">
          <v-sheet elevation="5" color="white" rounded>
            <v-col>
              <h1>Wikidata TopicTagger</h1>
              <div class="pt-6 pb-6 pr-8 pl-8">
                <p class="text-justify body-text pb-1">
                  This web app helps tagging scientific papers on
                  <a
                    target="_blank"
                    href="https://www.wikidata.org/wiki/Wikidata:Main_Page"
                    >Wikidata</a
                  >
                  with their supposed main subject, inferring these subjects
                  from the title of these papers.
                </p>
                <p class="text-justify body-text mb-1">
                  Start typing a topic like "Lyme disease" (<a
                    target="_blank"
                    href="https://www.wikidata.org/wiki/Q201989 "
                    >Q201989</a
                  >) on the input box below to gather
                  <a
                    target="_blank"
                    href="https://quickstatements.toolforge.org/#/"
                    >Quickstatements</a
                  >
                  commands to help you in your task!
                </p>
              </div>
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
          </v-sheet>
          <v-col> <QSBox :term="term" /> </v-col>
        </v-col>
      </v-row>
    </v-main>

    <v-footer padless color="primary">
      <v-col class="text-center white--text" cols="12">
        Made by
        <a
          href="https://github.com/jvfe"
          target="_blank"
          class="orange--text text--lighten-1"
        >
          <strong>jvfe</strong></a
        >
        based on an idea by
        <a
          href="https://github.com/lubianat"
          target="_blank"
          class="orange--text text--lighten-1"
          ><strong>lubianat</strong></a
        >
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import QSBox from "./components/QSBox";
import { searchWikibase } from "./lib/API";

export default {
  name: "App",

  components: {
    QSBox
  },

  data() {
    return {
      term: "",
      search: "",
      terms: [],
      loadingComplete: false
    };
  },

  watch: {
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
    }
  }
};
</script>
