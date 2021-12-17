<template>
  <div class="container mx-auto flex flex-col h-full space-y-2">
    <div class="h-20 w-full bg-zinc-700 rounded-2xl">내 자산 영역</div>
    <div class="grow w-full bg-zinc-700 rounded-2xl p-2">
      <PriceTable />
    </div>
  </div>
</template>

<script setup>
import PriceTable from '../components/PriceTable.vue';
</script>