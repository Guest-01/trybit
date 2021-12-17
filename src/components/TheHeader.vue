<template>
  <header class="flex p-3 justify-between bg-gradient-to-r from-slate-800 to-gray-600 items-center">
    <div class="flex space-x-1 text-slate-100 text-2xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-amber-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <router-link to="/">가상코인거래소</router-link>
    </div>
    <div class="space-x-4 mr-3 font-bold text-slate-100">
      <router-link to="/about">내 정보</router-link>
      <span>로그인</span>
      <span>회원가입</span>
    </div>
  </header>
</template>