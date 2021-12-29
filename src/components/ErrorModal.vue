<template>
  <BaseModal @close="$emit('close')" :show="show">
    <p class="text-center">{{ msg }}</p>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue";

export default {
  name: "ErrorModal",
  components: { BaseModal },
  props: ['show', 'msg']
}
</script>