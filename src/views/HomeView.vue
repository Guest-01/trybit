<template>
  <ProfileCard :currentUser="currentUser" />
  <section class="space-y-1 my-2">
    <CoinCard
      @buy="$emit('buy', coin, 'buy')"
      @sell="$emit('sell', coin, 'sell')"
      v-for="(coin, key) in coins"
      :key="key"
      :coin="coin"
    />
  </section>
</template>

<script>
import CoinCard from '../components/CoinCard.vue';
import ProfileCard from '../components/ProfileCard.vue';

export default {
  inheritAttrs: false,
  name: "HomeView",
  components: {
    CoinCard,
    ProfileCard,
  },
  props: ['coins', 'currentUser'],
  emits: ["buy", "sell"]
}
</script>

<style scoped>
.animate__animated {
  --animate-duration: 0.8s;
}
</style>