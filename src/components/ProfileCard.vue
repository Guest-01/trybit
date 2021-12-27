<template>
  <article class="bg-gradient-to-tl from-blue-200 to-blue-100 rounded-lg p-2">
    <!-- 로그인 했을 때 -->
    <div v-if="user" class="flex flex-col space-y-1">
      <div class="text-sm text-indigo-600">{{ user?.username }} 님</div>
      <div class="flex justify-between text-xl">
        <h2>총 자산</h2>
        <h2>{{ Number(totalBalance).toLocaleString() }}원</h2>
      </div>
      <div class="flex justify-between">
        <span>현금</span>
        <span>{{ Number(user?.cash).toLocaleString() }}원</span>
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
          <!-- 내 지갑 반복 -->
          <tr v-for="(coin, key) in user.coins" :key="key">
            <td class="text-left">{{ coin.name }}</td>
            <td>{{ Number(coin.buyAt).toLocaleString() }}</td>
            <td
              :class="{ 'text-red-600': isProfit, 'text-blue-600': isLoss }"
            >{{ profitNow(coin.buyAt, key) }}%</td>
            <td>{{ coin.count }}</td>
            <td
              :class="{ 'text-red-600': isProfit, 'text-blue-600': isLoss }"
            >{{ Number(priceNow(coin.count, key)).toLocaleString() }}</td>
          </tr>
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
import { collection, query, where, getDocs } from "@firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../my.firebase"

export default {
  name: "ProfileCard",
  props: ['coins'],
  data() {
    return {
      user: null,
      isProfit: false,
      isLoss: false,
    }
  },
  methods: {
    priceNow(count, coinCode) {
      return count * this.coins["KRW-" + coinCode].trade_price
    },
    profitNow(buyAt, coinCode) {
      const price = this.coins["KRW-" + coinCode].trade_price;
      const percentage = (price / buyAt - 1) * 100;
      this.isProfit = percentage > 0 ? true : false;
      this.isLoss = percentage < 0 ? true : false;
      return Number(percentage).toFixed(2);
    },
  },
  computed: {
    totalBalance() {
      if (this.user) {
        let coinValues = 0;
        for (const [code, coin] of Object.entries(this.user.coins)) {
          coinValues += this.priceNow(coin.count, code)
        }
        return coinValues + this.user.cash;
      } else {
        return null;
      }
    }
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("uid", "==", user.uid));
        const qSnapShot = await getDocs(q);
        qSnapShot.forEach((doc) => {
          this.user = doc.data();
        })
      } else {
        this.user = null;
      }
    })
  }
}
</script>