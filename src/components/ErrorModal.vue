<template>
  <BaseModal @closeModal="$emit('closeModal')">
    <p class="text-center">{{ msg }}</p>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue";

export default {
  name: "ErrorModal",
  components: { BaseModal },
  props: {
    msg: String,
  }
}
</script>