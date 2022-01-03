<template>
  <div class="flex flex-col h-full min-h-screen bg-gray-600 mx-auto">
    <TheHeader />
    <div class="hidden lg:block text-white text-center mt-2">이 웹사이트는 모바일에 최적화되어있습니다</div>
    <main class="p-2 max-w-screen-md mx-auto container">
      <router-view />
    </main>
    <footer class="text-white container mx-auto flex flex-col items-center py-2 mb-2">
      <a href="https://github.com/Guest-01/trybit" class="text-sm underline">To GitHub</a>
    </footer>
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
