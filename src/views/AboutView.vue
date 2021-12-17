<template>
  <div
    class="container mx-auto flex flex-col h-full space-y-2 bg-gray-300 p-4 rounded-3xl text-gray-900"
  >
    <div class="flex justify-between text-2xl">
      <span>총 자산</span>
      <span>123,123원</span>
    </div>
    <div class="flex justify-between border-b border-gray-100 pb-2">
      <span>현금</span>
      <span>123,123원</span>
    </div>
    <table>
      <thead>
        <tr>
          <th class="text-left">이름</th>
          <th class="text-right">구매가</th>
          <th class="text-right">현재가</th>
          <th class="text-right">수량</th>
          <th class="text-right">총 평가</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">###</td>
          <td class="text-right">###</td>
          <td class="text-right">###</td>
          <td class="text-right">###</td>
          <td class="text-right">###</td>
          <td class="text-right">
            <button class="bg-blue-700 rounded-lg hover:bg-blue-600 p-1 text-white">매도</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// firebase에서 저장된 내 자산정보 불러와서 채워넣고, 현재가는 ref로 불러와서 총평가는 computed로.

import { ref } from '@vue/reactivity';

const wallet = ref({
  BTC: {
    buyPrice: "123123",
    quantity: "3",
  },
  XRP: {
    buyPrice: "1234",
    quantity: "5"
  },
})
</script>