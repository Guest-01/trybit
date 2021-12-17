<template>
  <div class="flex flex-col h-screen">
    <TheHeader />
    <main class="bg-slate-800 grow p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
</script>

<style>
@import "@/assets/base.css";
</style>
