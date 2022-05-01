<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>회원가입</v-card-title>
        <v-card-subtitle>이메일만으로 손쉽게 가입하세요</v-card-subtitle>
        <v-card-text>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-text-field
              label="이메일"
              type="email"
              variant="filled"
              :rules="emailRules"
            />
            <v-text-field label="비밀번호" type="password" variant="filled" />
            <v-text-field
              label="비밀번호 확인"
              type="password"
              variant="filled"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="signup" color="primary">가입하기</v-btn>
          <v-btn @click="reset" color="secondary">리셋</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        (v) => !!v || "이메일을 입력해주세요",
        (v) => /.+@.+\..+/.test(v) || "올바른 이메일 형식이 아닙니다",
      ],
      pw: "",
      pwConfirm: "",
    };
  },
  methods: {
    signup() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>