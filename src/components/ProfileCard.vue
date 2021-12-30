<template>
  <article class="bg-gradient-to-tl from-blue-200 to-blue-100 rounded-lg p-2">
    <!-- 로그인 했을 때 -->
    <div v-if="user" class="flex flex-col space-y-1">
      <div class="text-sm text-indigo-600">{{ user?.displayName }} 님</div>
      <div class="flex justify-between text-xl">
        <h2>총 자산</h2>
        <h2>{{ formatNum(totalBalance) }}원</h2>
      </div>
      <div class="flex justify-between">
        <span>현금</span>
        <span>{{ formatNum(userDB?.cash) }}원</span>
      </div>
      <hr />
      <table class="text-sm">
        <thead class="text-right text-slate-500">
          <tr>
            <th class="text-left">이름</th>
            <th>평단가</th>
            <th>손익</th>
            <th>수량</th>
            <th>평가</th>
          </tr>
        </thead>
        <tbody class="text-right">
          <tr v-if="hasNoCoins">
            <td class="text-center text-gray-500" colspan="5">( 보유한 코인이 없습니다 )</td>
          </tr>
          <!-- 내 지갑 반복 -->
          <template v-for="(coin, key) in userCoins" :key="key">
            <!-- 카운트가 0 인 경우는 샀다가 전부 팔아서 없는거니까 안보여줌 -->
            <tr v-if="coin.count != 0">
              <td class="text-left">{{ coin.name }}</td>
              <!-- 평단가 -->
              <td>{{ formatNum(coin.buyAt) }}</td>
              <!-- 손익 -->
              <td
                :class="{ 'text-red-600': profitNow(coin.buyAt, key) > 0, 'text-blue-600': profitNow(coin.buyAt, key) < 0 }"
              >{{ profitNow(coin.buyAt, key) }}%</td>
              <!-- 수량 -->
              <td>{{ Math.floor(coin.count * 1000) / 1000 }}</td>
              <!-- 평가 -->
              <td
                :class="{ 'text-red-600': profitNow(coin.count, key) > 0, 'text-blue-600': profitNow(coin.count, key) < 0 }"
              >{{ formatNum(priceNow(coin.count, key)) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- 로그인 안했을 때 -->
    <div v-else class="flex justify-center items-center">
      <router-link
        to="/login"
        class="cursor-pointer underline underline-offset-2"
      >내 자산을 보시려면 로그인해주세요</router-link>
    </div>
  </article>
</template>

<script>
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase/config"

export default {
  name: "ProfileCard",
  data() {
    return {
      userDB: null,
      unsub: null
    }
  },
  methods: {
    formatNum(num) {
      return Number(Number(num).toFixed()).toLocaleString();
    },
    priceNow(count, coinCode) {
      return count * this.coins["KRW-" + coinCode].trade_price
    },
    profitNow(buyAt, coinCode) {
      const price = this.coins["KRW-" + coinCode].trade_price;
      const percentage = (price / buyAt - 1) * 100;
      return Number(percentage).toFixed(2);
    },
    checkEmpty(obj) {
      if (!obj) {
        return true;
      }
      if (Object.keys(obj).length === 0) {
        return true
      }
    },
  },
  computed: {
    hasNoCoins() {
      // 한번도 산적이 없어서 완전 비어있는 경우
      if (this.checkEmpty(this.userDB?.coins)) {
        return true
      } else {
        // count가 전부 0인 경우
        const counts = Object.values(this.userDB?.coins).map(coin => coin.count);
        return counts.every((val) => val === 0)
      }
    },
    coins() {
      return this.$store.state.coins
    },
    user() {
      return this.$store.state.user
    },
    userCoins() {
      return this.userDB?.coins;
    },
    totalBalance() {
      if (this.userDB) {
        let coinValues = 0;
        for (const [code, coin] of Object.entries(this.userDB.coins)) {
          coinValues += this.priceNow(coin.count, code)
        }
        return coinValues + this.userDB.cash;
      } else {
        return null;
      }
    }
  },
  async created() {
    if (this.user) {
      const userDocRef = doc(db, "users", this.user.uid)
      this.unsub = onSnapshot(userDocRef, (doc) => {
        console.log('change in DB detected')
        this.userDB = doc.data();
      })
    }
    console.log('Profile Created!')
  },
  unmounted() {
    if (this.unsub) {
      this.unsub()
      console.log('unsubscribed!')
    }
  }
}
</script>