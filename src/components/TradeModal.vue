<template>
  <BaseModal @closeModal="$emit('closeModal')">
    <h3 class="text-2xl mb-2">{{ coin.korean_name }} {{ coin.code }}</h3>
    <div class="flex justify-between w-full">
      <div class="flex flex-col">
        <span>현재가</span>
        <span>{{ Number(price).toLocaleString() }}</span>
      </div>
      <div class="flex flex-col items-center border-2 rounded-lg">
        <span class="bg-gray-200 w-full text-center">수량</span>
        <input
          v-model="quantity"
          type="number"
          name="quantity"
          id="quantity"
          class="w-14 text-center"
        />
      </div>
    </div>
    <div class="flex justify-between mt-4 font-bold items-center text-lg">
      <div>총 금액</div>
      <div class="space-x-2">
        <span>{{ Number(totalPrice).toLocaleString() }}</span>
        <button
          v-if="buy"
          class="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white rounded"
        >매수</button>
        <button
          v-else
          class="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded"
        >매도</button>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue";
export default {
  name: "TradeModal",
  components: { BaseModal },
  props: {
    buy: {
      type: Boolean,
      default: true
    },
    coin: {
      type: Object,
    },
    price: {
      type: Number
    }
  },
  data() {
    return {
      quantity: 0,
    }
  },
  computed: {
    totalPrice() {
      if (Number.isNaN(parseFloat(this.quantity))) {
        return 0;
      }
      return parseInt(this.price) * parseFloat(this.quantity)
    }
  },
}
</script>