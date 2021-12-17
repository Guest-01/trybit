<template>
  <table class="w-full text-slate-100">
    <thead>
      <tr class="border-b">
        <th class="text-left pl-1">한글명</th>
        <th class="text-right">현재가</th>
        <th class="text-right">전일대비</th>
        <th class="text-right">거래대금</th>
      </tr>
    </thead>
    <tbody class="text-sm">
      <tr v-for="coin in coins" :key="coin.code" class="hover:bg-zinc-600">
        <td class="p-1">
          <div class="font-semibold">{{ coin.korean_name }}</div>
          <div class="text-xs text-gray-400">{{ coin.code }}</div>
        </td>
        <td
          class="text-right font-bold align-top p-1"
        >{{ Number(coin.trade_price).toLocaleString() }}</td>
        <td
          :class="{ 'text-blue-400': isNegative(coin.signed_change_rate), 'text-red-400': isPositive(coin.signed_change_rate) }"
          class="text-right p-1"
        >
          <div>{{ Number(coin.signed_change_rate).toFixed(2) }}%</div>
          <div class="text-xs">{{ coin.signed_change_price }}</div>
        </td>
        <td class="text-right align-top p-1">{{ convertTp24h(coin.acc_trade_price_24h) }}</td>
        <td class="text-right p-1">
          <button class="bg-red-700 rounded-lg hover:bg-red-600 p-1">매수</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { numToKorean } from "num-to-korean"
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

const coins = ref({})

function convertTp24h(volume) {
  return numToKorean(Math.floor(volume / 100000000) * 100000000, 'mixed')
}

async function getKRWCoins() {
  const { data: allMarkets } = await axios.get('https://api.upbit.com/v1/market/all')
  return allMarkets.filter(coin => coin.market.startsWith('KRW-'));
}

function isNegative(value) {
  return String(value).startsWith('-');
}

function isPositive(value) {
  if (!String(value).startsWith('-') && parseFloat(value) > 0) {
    return true;
  }
  return false;
}

let socket;

onMounted(async () => {
  const krw = await getKRWCoins()

  krw.forEach(coin => {
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