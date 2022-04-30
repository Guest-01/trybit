<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>회원가입</v-card-title>
        <v-card-subtitle>이메일만으로 손쉽게 가입하세요</v-card-subtitle>
        <v-card-text>
          <v-form>
            <v-text-field label="이메일" variant="outlined" density="compact" />
            <v-text-field label="비밀번호" type="password" variant="outlined" density="compact" />
            <v-btn color="primary">가입하기</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SignUp",
};
</script>

<style>
</style>