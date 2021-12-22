<template>
  <div
    class="bg-gradient-to-tl from-slate-300 to-slate-200 rounded-lg p-2 flex flex-col items-center"
  >
    <h2 class="text-xl font-bold">회원가입</h2>
    <p class="text-sm">간단하게 가입 후 시작하세요</p>
    <hr class="my-2 w-full" />
    <form @submit.prevent="signup" class="flex flex-col w-full text-sm space-y-1">
      <label for="username">닉네임</label>
      <input type="text" name="username" id="username" />
      <label for="email">이메일</label>
      <input type="email" name="email" id="email" />
      <label for="password">비밀번호</label>
      <input type="password" name="password" id="password" />
      <label for="passwordConfirm">비밀번호확인</label>
      <input type="password" name="passwordConfirm" id="passwordConfirm" />
      <div class="p-2 m-2">
        <p class="text-xs">해당 사이트는 모의 투자 사이트이며, 실제 투자에 대한 조언이나 근거로 사용될 수 없습니다.</p>
        <div class="space-x-1 text-right text-sm">
          <input type="checkbox" name="agree" id="agree" />
          <label for="agree">동의함</label>
        </div>
      </div>
      <button type="submit" class="bg-indigo-500 text-white rounded mt-4 text-base py-2">회원가입</button>
    </form>
    <button class="bg-white p-2 rounded w-full my-4">또는 구글로 로그인</button>
  </div>
</template>

<script>
export default {
  name: "SignUpView",
  methods: {
    signup() {
      console.log('submit!')
    }
  }
}
</script>

<style scoped>
input {
  @apply p-2 rounded;
}
</style>