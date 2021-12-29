<template>
  <header
    class="flex p-3 justify-between bg-gradient-to-r from-slate-800 to-gray-600 items-center fixed w-full"
  >
    <div @click="mobileNavOpen = false" class="flex space-x-1 text-slate-100 text-xl items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-amber-300"
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
      <router-link to="/">트라이빗</router-link>
    </div>
    <div v-show="!mobileNavOpen" class="sm:hidden" @click="mobileNavOpen = true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-slate-100 hover:rotate-180 transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </div>
    <nav class="hidden sm:block space-x-4 mr-3 font-bold text-slate-100">
      <span>
        <router-link to="/login">로그인</router-link>
      </span>
      <span>
        <router-link to="/signup">회원가입</router-link>
      </span>
    </nav>
  </header>
  <transition enter-active-class="animate__animated animate__slideInRight animate__faster">
    <nav
      v-show="mobileNavOpen"
      class="flex flex-col space-y-3 items-end bg-gray-200 p-4 sm:hidden top-1 right-1 rounded-lg fixed shadow-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 hover:rotate-180 transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="mobileNavOpen = false"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <ul @click="mobileNavOpen = false">
        <div v-if="!user" class="flex flex-col items-end space-y-2">
          <li>
            <router-link to="/login">로그인</router-link>
          </li>
          <li>
            <router-link to="/signup">회원가입</router-link>
          </li>
        </div>
        <div v-else>
          <li>
            <button @click="logout">로그아웃</button>
          </li>
        </div>
      </ul>
    </nav>
  </transition>
</template>

<script>
export default {
  name: "TheHeader",
  components: {},
  data() {
    return {
      mobileNavOpen: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    authIsReady() {
      return this.$store.state.authIsReady;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/')
    }
  },
}
</script>