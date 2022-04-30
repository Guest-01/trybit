<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-title>트라이빗 TryBit</v-app-bar-title>
      <v-btn>로그인</v-btn>
      <v-btn to="/signup">회원가입</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      Copyright <v-icon size="x-small">mdi-copyright</v-icon> 2022 Guest-01
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>
