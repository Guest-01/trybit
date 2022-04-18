<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Home Page</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">Counter: {{ counter }}</v-col>
      <v-col><v-btn @click="increment" color="success">up</v-btn></v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn @click="open">open</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="close">close</v-btn>
      </v-col>
      <v-col cols="auto"> Open Console to See. </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    counter() {
      return this.$store.state.counter;
    },
  },
  methods: {
    increment() {
      this.$store.commit("SET_COUNTER", this.counter + 1);
    },
    open() {
      this.$store.dispatch("openSocket");
    },
    close() {
      this.$store.dispatch("closeSocket");
    },
  },
};
</script>

<style>
</style>