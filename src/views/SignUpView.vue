<template>
  <teleport to="body">
    <ErrorModal @close="modalActive = false" :show="modalActive" :msg="error" />
  </teleport>
  <div
    class="bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-2 flex flex-col items-center"
  >
    <h2 class="text-xl font-bold">회원가입</h2>
    <p class="text-sm">가입시 시드머니 500,000원이 주어집니다</p>
    <p class="text-sm">
      (파산 시
      <span class="font-bold">내 정보</span>에서 복구하세요)
    </p>
    <hr class="my-2 w-full" />
    <form @submit.prevent="signup" class="flex flex-col w-full text-sm space-y-1">
      <div>
        <label for="username">닉네임</label>
        <span
          class="ml-2 text-xs text-red-500"
          v-for="error of v$.username.$errors"
          :key="error.$uid"
        >{{ error.$message }}</span>
      </div>
      <input v-model="username" type="text" name="username" id="username" />
      <div>
        <label for="email">이메일</label>
        <span
          class="ml-2 text-xs text-red-500"
          v-for="error of v$.email.$errors"
          :key="error.$uid"
        >{{ error.$message }}</span>
      </div>
      <input v-model="email" type="email" name="email" id="email" />
      <div>
        <label for="password">비밀번호</label>
        <span
          class="ml-2 text-xs text-red-500"
          v-for="error of v$.password.password.$errors"
          :key="error.$uid"
        >{{ error.$message }}</span>
      </div>
      <input v-model="password.password" type="password" name="password" id="password" />
      <div>
        <label for="passwordConfirm">비밀번호확인</label>
        <span
          class="ml-2 text-xs text-red-500"
          v-for="error of v$.password.pwconfirm.$errors"
          :key="error.$uid"
        >{{ error.$message }}</span>
      </div>
      <input
        v-model="password.pwconfirm"
        type="password"
        name="passwordConfirm"
        id="passwordConfirm"
      />
      <div class="p-2 m-2">
        <p class="text-xs">해당 사이트는 모의 투자 사이트이며, 이뤄지는 모든 투자 행위와 표기된 재화는 실제 효력이 없습니다.</p>
        <div class="space-x-1 text-right text-sm">
          <span
            class="ml-2 text-xs text-red-500"
            v-for="error of v$.agree.$errors"
            :key="error.$uid"
          >{{ error.$message }}</span>
          <input v-model="agree" type="checkbox" name="agree" id="agree" />
          <label for="agree">동의함</label>
        </div>
      </div>
      <button
        v-if="loading"
        type="submit"
        class="bg-gray-500 text-white rounded mt-4 text-base py-2"
        disabled
      >가입진행중...</button>
      <button v-else type="submit" class="bg-indigo-500 text-white rounded mt-4 text-base py-2">회원가입</button>
    </form>
    <!-- <button class="bg-white p-2 rounded w-full my-4">또는 구글로 로그인</button> -->
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { kRequired, kEmail, kMinLength, kMaxLength, kSameAs, kAgree } from '../utils/koreanValidator';
import ErrorModal from '../components/ErrorModal.vue';
import { db } from "../firebase/config"
import { doc, setDoc } from "firebase/firestore"

export default {
  inheritAttrs: false,
  name: "SignUpView",
  components: { ErrorModal },
  data() {
    return {
      error: null,
      modalActive: false,
      v$: useVuelidate(),
      username: '',
      email: '',
      password: {
        password: '',
        pwconfirm: '',
      },
      agree: null,
      loading: false,
    }
  },
  validations() {
    return {
      username: { required: kRequired, maxLength: kMaxLength },
      email: { required: kRequired, email: kEmail },
      password: {
        password: { required: kRequired, minLength: kMinLength },
        pwconfirm: { required: kRequired, sameAs: kSameAs(this.password.password) },
      },
      agree: { sameAs: kAgree }
    }
  },
  methods: {
    async signup() {
      this.v$.$validate()
      if (!this.v$.$error) {
        // TODO: check username isUnique
        try {
          this.loading = true;
          await this.$store.dispatch('signup', { username: this.username, email: this.email, password: this.password.password });
          // DB 생성하고 초기 cash 지급
          await setDoc(doc(db, "users", this.$store.state.user.uid), {
            uid: this.$store.state.user.uid,
            cash: 500000,
            coins: {},
          })
          this.$router.push('/')
        } catch (error) {
          this.modalActive = true;
          switch (error.code) {
            case "auth/email-already-in-use":
              this.error = "이미 가입된 회원입니다"
              break;
            case "auth/invalid-email":
              this.error = "유효하지 않은 이메일입니다"
              break;
            case "auth/weak-password":
              this.error = "너무 쉬운 비밀번호입니다"
              break;
            default:
              console.log(JSON.stringify(error));
              this.modalActive = true;
              this.error = error.code;
              break;
          }
        } finally {
          this.loading = false;
        }
      } else {
        console.error("form validation error")
      }
    }
  }
}
</script>

<style scoped>
input {
  @apply p-2 rounded;
}
</style>