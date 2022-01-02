<template>
  <teleport to="body">
    <ErrorModal @close="modalActive = false" :show="modalActive" :msg="error" />
  </teleport>
  <div
    class="bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-2 flex flex-col items-center"
  >
    <h2 class="text-xl font-bold">비밀번호 재설정</h2>
    <p class="text-sm mt-2">가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다</p>
    <hr class="my-2 w-full" />
    <form @submit.prevent="resetPw" class="flex flex-col w-full text-sm space-y-2">
      <div>
        <label for="email">이메일</label>
        <span v-if="errorMsg" class="text-red-500 ml-2">{{ errorMsg }}</span>
      </div>
      <input v-model="email" type="email" name="email" id="email" class="p-2 rounded" required />
      <button
        v-if="loading"
        id="resetPwBtn"
        type="submit"
        class="bg-gray-500 text-white rounded mt-4 text-base py-2"
        disabled
      >처리중입니다...</button>
      <button
        v-else
        id="resetPwBtn"
        type="submit"
        class="bg-indigo-500 text-white rounded mt-4 text-base py-2 disabled:bg-gray-500 transition-all"
      >비밀번호 재설정</button>
    </form>
  </div>
</template>

<script>
import { auth } from "../firebase/config"
import { sendPasswordResetEmail } from "firebase/auth"
import ErrorModal from '../components/ErrorModal.vue';

export default {
  name: "ResetPwView",
  components: { ErrorModal },
  data() {
    return {
      email: "",
      errorMsg: null,
      modalActive: false,
      error: null,
      loading: false,
    }
  },
  methods: {
    async resetPw() {
      this.loading = true
      try {
        await sendPasswordResetEmail(auth, this.email)
        this.modalActive = true;
        this.error = "비밀번호 재설정 이메일을 보냈습니다"
        this.errorMsg = null;
        this.email = "";
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-email":
            this.errorMsg = "올바른 이메일이 아닙니다";
            break;
          case "auth/user-not-found":
            this.errorMsg = "존재하지 않는 회원입니다"
            break;
          default:
            this.errorMsg = "관리자에게 문의해주세요"
            console.warn(error.code);
            break;
        }
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      }
    }
  }
}
</script>