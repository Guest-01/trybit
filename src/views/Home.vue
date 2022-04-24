<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Home Page</h1>
      </v-col>
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
    <v-row>
      <v-col cols="auto">
        <v-btn @click="getCandle">get candle</v-btn>
      </v-col>
      <v-col cols="auto">
        <line-chart :chartData="chartData" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import LineChart from "../components/LineChart.vue";

export default {
  name: "Home",
  components: { LineChart },
  data() {
    return {
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: [40, 20, 12],
          },
        ],
      },
      chartOptions: {
        responsive: false,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    open() {
      this.$store.dispatch("openSocket");
    },
    close() {
      this.$store.dispatch("closeSocket");
    },
    async getCandle() {
      const res = await axios.get("https://api.upbit.com/v1/candles/days", {
        params: { market: "KRW-BTC", count: 30 },
      });

      this.chartData = {
        labels: res.data.map((d) => d.candle_date_time_kst).reverse(),
        datasets: [
          {
            label: res.data[0].market,
            backgroundColor: "#f87979",
            data: res.data.map((d) => d.trade_price).reverse(),
          },
        ],
      };
    },
  },
};
</script>

<style>
</style>