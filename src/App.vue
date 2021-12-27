<template>
  <div class="flex flex-col h-screen bg-gray-600">
    <TheHeader />
    <TradeModal
      :coin="selectedCoin"
      :price="selectedCoinPrice"
      :buy="buy"
      @closeModal="modalActive = false"
      :modalActive="modalActive"
    />
    <main class="mt-16 pb-2 px-2">
      <router-view @buy="openTradeModal" @sell="openTradeModal" :coins="coins" />
    </main>
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import TradeModal from './components/TradeModal.vue';

const coins = ref({})
const modalActive = ref(false)
const buy = ref(true)
const selectedCoin = ref({})
const selectedCoinPrice = computed(() => {
  if (coins.value["KRW-" + selectedCoin.value.code]) {
    return coins.value["KRW-" + selectedCoin.value.code].trade_price
  } else {
    return 0
  }
})

function openTradeModal(coin, buyOrSell) {
  if (buyOrSell === 'buy') {
    buy.value = true
  } else {
    buy.value = false;
  }
  modalActive.value = true;
  selectedCoin.value = coin
}

async function getKRWCoins() {
  const { data: allMarkets } = await axios.get('https://api.upbit.com/v1/market/all')
  return allMarkets.filter(coin => coin.market.startsWith('KRW-'));
}

function filteredCoins(coins) {
  const wanted = ["KRW-BTC", "KRW-XRP", "KRW-DOGE", "KRW-ETH",]
  // "KRW-ETC", "KRW-EOS", "KRW-MLK", "KRW-SAND"
  return coins.filter((coin) => wanted.includes(coin.market))
}

let socket;

onMounted(async () => {
  const krw = await getKRWCoins()

  const filtered = filteredCoins(krw)

  filtered.forEach(coin => {
    coins.value[coin.market] = { korean_name: coin.korean_name, enlgish_name: coin.english_name }
  });

  socket = new WebSocket('wss://api.upbit.com/websocket/v1')

  socket.onopen = (e) => {
    console.log('[open] 웹소켓이 열렸습니다');
    socket.send(
      `${JSON.stringify(
        [{ ticket: uuidv4() }, { type: 'ticker', codes: krw.map(c => c.market) }]
      )}`
    )
  }

  socket.onmessage = async (event) => {
    const ticker = await new Response(event.data).json()
    if (ticker.code in coins.value) {
      coins.value[ticker.code] = { ...coins.value[ticker.code], ...ticker }
      coins.value[ticker.code].code = ticker.code.replace('KRW-', '');
      // console.log(coins.value)
    }
  }

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
    } else {
      // 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
      // event.code가 1006이 됩니다.
      console.log('[close] 커넥션이 죽었습니다.');
    }
  }

  socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
  }

})

onBeforeUnmount(() => {
  socket.close()
})

                                                                                                                                                                                                                                                                                                </script>

<style>
@import "@/assets/base.css";
</style>
