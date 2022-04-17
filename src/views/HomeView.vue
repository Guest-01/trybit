<template>
  <ProfileCard v-if="authIsReady" />
  <section class="mt-2 space-y-1 md:grid md:grid-cols-2 md:gap-1.5 md:space-y-0">
    <CoinCard
      @buy="showBuyModal"
      @sell="showSellModal"
      v-for="(coin, key) in coins"
      :key="key"
      :coin="coin"
    />
    <teleport to="body">
      <TradeModal
        v-if="authIsReady"
        @close="showModal = false"
        :show="showModal"
        :isBuy="isBuy"
        :code="codeToModal"
      />
    </teleport>
  </section>
</template>

<script>
import CoinCard from "../components/CoinCard.vue";
import ProfileCard from "../components/ProfileCard.vue";
import TradeModal from "../components/TradeModal.vue";

export default {
  name: "HomeView",
  components: {
    CoinCard,
    ProfileCard,
    TradeModal,
  },
  data() {
    return {
      showModal: false,
      isBuy: false,
      codeToModal: "",
    };
  },
  computed: {
    coins() {
      return this.$store.state.coins;
    },
    authIsReady() {
      return this.$store.state.authIsReady;
    },
  },
  methods: {
    showBuyModal(code) {
      this.showModal = true;
      this.isBuy = true;
      this.codeToModal = code;
    },
    showSellModal(code) {
      this.showModal = true;
      this.isBuy = false;
      this.codeToModal = code;
    },
  },
};
</script>

<style scoped>
.animate__animated {
  --animate-duration: 0.8s;
}
</style>