<template>
  <teleport to="body">
    <ErrorModal @close="modalActive = false" :show="modalActive" :msg="error" />
  </teleport>
  <div
    class="bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-2 flex flex-col items-center"
  >
    <h2 class="text-xl font-bold">로그인</h2>
    <hr class="my-2 w-full" />
    <form @submit.prevent="login" class="flex flex-col w-full text-sm space-y-2">
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
          v-for="error of v$.password.$errors"
          :key="error.$uid"
        >{{ error.$message }}</span>
      </div>
      <input v-model="password" type="password" name="password" id="password" />
      <button type="submit" class="bg-indigo-500 text-white rounded mt-4 text-base py-2">로그인</button>
    </form>
    <button class="bg-white p-2 rounded w-full my-4">또는 구글로 로그인</button>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { kRequired, kEmail, kMinLength } from '../utils/koreanValidator';
import ErrorModal from '../components/ErrorModal.vue';

export default {
  inheritAttrs: false,
  name: "LoginView",
  components: { ErrorModal },
  data() {
    return {
      v$: useVuelidate(),
      email: "",
      password: "",
      modalActive: false,
      error: null,
    };
  },
  validations() {
    return {
      email: { required: kRequired, email: kEmail },
      password: { required: kRequired, minLength: kMinLength },
    };
  },
  methods: {
    async login() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          await this.$store.dispatch('login', { email: this.email, password: this.password })
          this.$router.push("/");
        }
        catch (error) {
          switch (error.code) {
            case "auth/wrong-password":
              this.modalActive = true;
              this.error = "비밀번호가 맞지 않습니다"
              break;
            case "auth/user-not-found":
              this.modalActive = true;
              this.error = "존재하지 않는 회원입니다"
              break;
            case "auth/too-many-requests":
              this.modalActive = true;
              this.error = "잠시 후에 다시 시도하세요"
              break;
            default:
              console.log(JSON.stringify(error));
              this.modalActive = true;
              this.error = error.code;
              break;
          }
        }
      }
      else {
        console.error("form validation error");
      }
    }
  },
}
</script>

<style scoped>
input {
  @apply p-2 rounded;
}
</style>