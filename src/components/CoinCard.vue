<template>
  <article
    class="bg-gradient-to-tl from-slate-300 to-slate-50 rounded-lg p-2 shadow flex justify-between"
  >
    <div class="flex flex-col flex-grow">
      <h2 class="text-lg font-bold">
        {{ coin.korean_name }}
        <span class="text-base text-gray-500 font-normal">{{ coin.code }}</span>
      </h2>
      <div class="text-sm flex justify-between mt-1">
        <div class="flex flex-col">
          <span>현재가</span>
          <span
            :class="{ 'text-red-600': isPositive(coin.signed_change_price), 'text-blue-600': isNegative(coin.signed_change_price) }"
          >{{ Number(coin.trade_price).toLocaleString() }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span>전일대비</span>
          <span
            :class="{ 'text-red-600': isPositive(coin.signed_change_price), 'text-blue-600': isNegative(coin.signed_change_price) }"
          >{{ Number(coin.signed_change_rate).toFixed(2) }}%</span>
          <span
            :class="{ 'text-red-600': isPositive(coin.signed_change_price), 'text-blue-600': isNegative(coin.signed_change_price) }"
            class="text-xs font-normal"
          >{{ Number(coin.signed_change_price).toLocaleString() }}</span>
        </div>
        <div class="flex flex-col text-right">
          <span>거래대금</span>
          <span>{{ convertTp24h(coin.acc_trade_price_24h) }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-14 justify-evenly ml-4">
      <button
        @click="$emit('buy', coin.code)"
        class="bg-gradient-to-r from-red-500 to-red-600 text-white rounded p-1"
      >매수</button>
      <button
        @click="$emit('sell', coin.code)"
        class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded p-1"
      >매도</button>
    </div>
  </article>
</template>

<script>
import { numToKorean } from "num-to-korean"

export default {
  name: "CoinCard",
  components: {},
  emits: ['buy', 'sell'],
  props: {
    coin: {
      type: Object,
      default: {
        korean_name: "OO코인",
        code: "OOO",
        trade_price: "123123",
        signed_change_rate: "-12",
        signed_change_price: "-1231",
        acc_trade_price_24h: "1231231231"
      }
    },
  },
  methods: {
    convertTp24h(volume) {
      return numToKorean(Math.floor(volume / 100000000) * 100000000, 'mixed')
    },
    isNegative(value) {
      return String(value).startsWith('-');
    },
    isPositive(value) {
      if (!String(value).startsWith('-') && parseFloat(value) > 0) {
        return true;
      }
      return false;
    },
  }
}
</script>