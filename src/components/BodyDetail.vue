<template>
  <div class="body-detail">
    <h1>Account: {{account === '' ? 'No account connected': account}}</h1>
    <h1>ChainId: {{ chainId }}</h1>
  </div>
</template>

<style>
.body-detail {
  padding-left: 25px;
  padding-right: 25px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'

export default defineComponent({
  computed: {
    account () {
      return store.state.defaultAccount
    },
    chainId () {
      return store.state.chainId
    }
  }
})
</script>
