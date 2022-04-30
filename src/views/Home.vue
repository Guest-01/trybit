<template>
  <v-row>
    <v-col cols="12">
      <h1>비트코인 모의투자하기</h1>
    </v-col>
  </v-row>
  <v-row max-height:>
    <v-col>
      <v-card>
        <v-card-title>
          <span>BTC/KRW</span>
        </v-card-title>
        <v-card-text>
          <line-chart :chartData="chartData" :chartOptions="chartOptions" height="260" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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