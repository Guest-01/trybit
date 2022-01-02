<template>
  <div class="flex flex-col bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-3">
    <div class="text-indigo-500 text-lg font-bold mb-2">내 정보</div>
    <div v-if="user" class="space-y-2">
      <div>닉네임: {{ user.displayName }}</div>
      <div>이메일: {{ user.email }}</div>
      <div>가입 일시: {{ convertTime(user.metadata.createdAt) }}</div>
      <div>최근 로그인: {{ convertTime(user.metadata.lastLoginAt) }}</div>
      <div class="space-x-2">
        <span>보유 현금: {{ formatMoney(userDB?.cash) }}원</span>
        <button
          @click="resetAccount"
          class="text-sm rounded-xl px-2 bg-red-600 text-white active:bg-red-700 hover:bg-red-500"
        >reset</button>
      </div>
      <div v-if="errorMsg" class="text-red-600">{{ errorMsg }}</div>
    </div>
    <div v-else>로그인한 유저가 없습니다</div>
  </div>
  <div class="flex flex-col bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-3 mt-1.5">
    <div class="text-indigo-500 text-lg font-bold mb-2">최근 거래내역 (마지막 20회)</div>
    <table>
      <thead class="text-sm">
        <tr>
          <th class="text-left">거래일시</th>
          <th class="text-left">종류</th>
          <th class="text-right">수량</th>
          <th class="text-right">거래가</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transactions" class="text-sm">
          <td>{{ convertTimeForTransactions(item.timestamp.seconds) }}</td>
          <td>{{ item.coinCode }}</td>
          <td class="text-right">{{ Math.floor(item.count * 1000) / 1000 }}</td>
          <td class="text-right">{{ Number(item.price).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { db } from "../firebase/config"
import { doc, getDoc, collection, query, where, orderBy, getDocs, limit, updateDoc, increment, serverTimestamp } from "firebase/firestore"
export default {
  name: "MyPageView",
  data() {
    return {
      userDB: null,
      transactions: [],
      errorMsg: null,
    }
  },
  methods: {
    convertTime(t) {
      const newT = moment.unix(t / 1000)
      return newT.format("YYYY-MM-DD (ddd) HH:mm:ss")
    },
    formatMoney(num) {
      return Number(Number(num).toFixed()).toLocaleString()
    },
    convertTimeForTransactions(t) {
      const newT = moment.unix(t)
      return newT.format("YY-MM-DD HH:mm:ss")
    },
    async resetAccount() {
      // Validations 1) 돈이 50만 이하인지, 2) 보유한 코인이 없는지
      if (this.userDB.cash >= 500000) {
        this.errorMsg = "현재 보유한 현금이 500,000 이상입니다"
        return
      }
      const coinArray = Object.values(this.userDB?.coins).map(coin => coin.count);
      if (coinArray && !coinArray.every((val) => val === 0)) {
        this.errorMsg = "보유중인 코인이 있습니다"
        return
      }

      console.log('validation pass! (resetAccount)')
      // reset cash to 500,000
      const userDocRef = doc(db, "users", this.user.uid)
      await updateDoc(userDocRef, {
        cash: 500000,
        resetCount: increment(1),
        lastResetAt: serverTimestamp()
      })
      this.userDB = await (await getDoc(doc(db, "users", this.user.uid))).data();
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  async created() {
    if (this.user) {
      this.userDB = await (await getDoc(doc(db, "users", this.user.uid))).data();

      // get transactions within 3 days
      let threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("userId", "==", this.user.uid), orderBy("timestamp", "desc"), limit(20))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        this.transactions.push(doc.data())
      })
    }
  }
}
</script>