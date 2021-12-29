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
        <span>{{ Number(totalPrice).toLocaleString() }}</span>
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
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from "firebase/firestore"
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
      selectVal: null,
    }
  },
  watch: {
    selectVal: function (val) {
      // db에서 현금 가져온 뒤 quantity 계산해서 입력
    }
  },
  computed: {
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
      this.$emit('close')
    },
    async makeTransaction(buy) {
      if (!auth.currentUser) {
        this.errorMsg = "로그인이 필요합니다"
        return
      }
      if (this.quantity <= 0) {
        this.errorMsg = "올바른 수량을 입력해주세요"
        return
      }
      // add more validation (돈이 없는데 산다던지, 없는걸 판다던지)
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      const userDB = docSnap.data();

      try {
        // add transaction
        await addDoc(collection(db, "transactions"), {
          userId: auth.currentUser.uid,
          coinCode: this.coin.code,
          price: this.coin.trade_price,
          count: buy ? this.quantity : -this.quantity,
          timestamp: serverTimestamp(),
        })
        // update userDB, 평단가 계산.
        const oBuyAt = userDB.coins[this.coin.code]?.buyAt;
        const oCount = userDB.coins[this.coin.code]?.count;
        let newBuyAt;
        if (oBuyAt && oCount) {
          const totalPrice = (oBuyAt * oCount) + (this.coin.trade_price * this.quantity);
          const totalQuantity = oCount + this.quantity;
          newBuyAt = totalPrice / totalQuantity;
        } else {
          newBuyAt = this.coin.trade_price;
        }
        await updateDoc(userDocRef, {
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
  }
}
</script>