<template>
  <div class="flex flex-col h-screen bg-gray-600">
    <TheHeader />
    <main class="mt-16 pb-2 px-2">
      <router-view />
    </main>
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';

export default {
  name: "App",
  components: {
    TheHeader,
  },
  created() {
    this.$store.dispatch('openSocket');
  }
}
</script>

<style>
@import "@/assets/base.css";
</style>
