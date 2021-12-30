<template>
  <BaseModal @close="closeModal" :show="show">
    <h3 class="text-2xl mb-2">{{ coin?.korean_name }} {{ coin.code }}</h3>
    <div class="flex justify-between w-full">
      <div class="flex flex-col">
        <span>현재가</span>
        <span>{{ Number(coin.trade_price).toLocaleString() }}</span>
      </div>
      <div class="flex flex-col items-center border-2 rounded-lg">
        <div class="flex">
          <span class="bg-gray-200 w-full text-center px-1">수량</span>
          <input
            v-model="quantity"
            type="number"
            name="quantity"
            id="quantity"
            class="w-14 text-center"
          />
        </div>
        <div class="w-full">
          <select
            v-model="selectVal"
            name="quantity-select"
            id="quantity-select"
            class="bg-gray-200 w-full h-full"
          >
            <option selected>선택</option>
            <option value="100">100%</option>
            <option value="50">50%</option>
            <option value="20">20%</option>
            <option value="10">10%</option>
          </select>
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-4 font-bold items-center text-lg">
      <div>총 금액</div>
      <div class="space-x-2">
        <span>{{ Number(Number(totalPrice).toFixed()).toLocaleString() }}</span>
        <button
          v-if="isBuy"
          @click="makeTransaction(isBuy)"
          class="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white rounded"
        >매수</button>
        <button
          v-else
          @click="makeTransaction(isBuy)"
          class="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded"
        >매도</button>
      </div>
    </div>
    <div class="text-red-500">{{ errorMsg }}</div>
  </BaseModal>
</template>

<script>
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, onSnapshot } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import BaseModal from "./BaseModal.vue";

export default {
  name: "TradeModal",
  components: { BaseModal },
  props: ['isBuy', 'code', 'show'],
  emits: ['close'],
  data() {
    return {
      quantity: 0,
      errorMsg: null,
      selectVal: "선택",
      userDocRef: null,
      userDB: null,
      unsub: null,
    }
  },
  watch: {
    selectVal(val) {
      if (val === "선택") {
        this.quantity = 0
        return
      }
      if (this.isBuy) {
        const num = this.userDB.cash / this.coin.trade_price
        const bool = this.userDB.cash > this.coin.trade_price

        switch (val) {
          case "100":
            this.quantity = bool ? Math.trunc(num) : Math.floor(num * 1000) / 1000
            break;
          case "50":
            this.quantity = bool ? Math.trunc(num / 2) : Math.floor(num / 2 * 1000) / 1000
            break;
          case "20":
            this.quantity = bool ? Math.trunc(num / 5) : Math.floor(num / 5 * 1000) / 1000
            break;
          case "10":
            this.quantity = bool ? Math.trunc(num / 10) : Math.floor(num / 10 * 1000) / 1000
            break;
          default:
            this.quantity = 0;
            console.error('unexpected select value:', val)
            break;
        }
      } else {
        const num = this.userDB.coins[this.coin.code]?.count;
        if (!num || num === 0) {
          this.errorMsg = "보유중이지 않습니다"
          return
        }
        switch (val) {
          case "100":
            this.quantity = num
            break;
          case "50":
            this.quantity = Math.floor(num / 2 * 1000) / 1000
            break;
          case "20":
            this.quantity = Math.floor(num / 5 * 1000) / 1000
            break;
          case "10":
            this.quantity = Math.floor(num / 10 * 1000) / 1000
            break;

          default:
            this.quantity = 0;
            console.error('unexpected select value:', val)
            break;
        }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    coin() {
      return this.$store.state.coins["KRW-" + this.code]
    },
    totalPrice() {
      if (Number.isNaN(parseFloat(this.quantity))) {
        return 0;
      }
      return parseInt(this.coin.trade_price) * parseFloat(this.quantity)
    },
  },
  methods: {
    closeModal() {
      this.errorMsg = null;
      this.quantity = 0;
      this.selectVal = "선택";
      this.$emit('close')
    },
    async makeTransaction(buy) {
      // Validations start
      if (!auth.currentUser) {
        this.errorMsg = "로그인이 필요합니다"
        return
      }
      if (this.quantity <= 0) {
        this.errorMsg = "올바른 수량을 입력해주세요"
        return
      }

      // 고객 지갑 확인

      // 돈이 모자라는데 사려는 경우
      if (buy && this.userDB.cash < this.totalPrice) {
        this.errorMsg = "잔고가 부족합니다"
        return
      }

      // 없는걸 팔려고 하는 경우
      if (!buy && this.userDB.coins[this.coin.code] === undefined) {
        this.errorMsg = "보유중인 수량이 부족합니다"
        return
      }
      if (!buy && this.userDB.coins[this.coin.code]?.count < this.quantity) {
        this.errorMsg = "보유중인 수량이 부족합니다"
        return
      }

      try {
        // add transaction
        await addDoc(collection(db, "transactions"), {
          userId: auth.currentUser.uid,
          coinCode: this.coin.code,
          price: this.coin.trade_price,
          count: buy ? this.quantity : -this.quantity,
          timestamp: serverTimestamp(),
        })
        // update this.userDB, 평단가 계산.
        const oBuyAt = this.userDB.coins[this.coin.code]?.buyAt;
        const oCount = this.userDB.coins[this.coin.code]?.count;
        let newBuyAt;
        if (oBuyAt && oCount) {
          const totalPrice = (oBuyAt * oCount) + (this.coin.trade_price * this.quantity);
          const totalQuantity = oCount + this.quantity;
          newBuyAt = totalPrice / totalQuantity;
        } else {
          newBuyAt = this.coin.trade_price;
        }
        await updateDoc(this.userDocRef, {
          cash: buy ? increment(-this.totalPrice) : increment(this.totalPrice),
          [`coins.${this.coin.code}.name`]: this.coin.korean_name,
          [`coins.${this.coin.code}.count`]: buy ? increment(this.quantity) : increment(-this.quantity),
          [`coins.${this.coin.code}.buyAt`]: newBuyAt,
        })

        this.errorMsg = null;
        this.closeModal();
        return
      } catch (err) {
        this.errorMsg = "네트워크 오류"
        console.error(err)
        return
      }
    }
  },
  async created() {
    if (this.user) {
      this.userDocRef = doc(db, "users", this.user.uid)
      this.unsub = onSnapshot(this.userDocRef, (doc) => {
        console.log('change in DB detected')
        this.userDB = doc.data();
      })
    }
    console.log('TradeModal Created!')
  },
  unmounted() {
    if (this.unsub) {
      this.unsub()
      console.log('unsubscribed!')
    }
  }
}
</script>