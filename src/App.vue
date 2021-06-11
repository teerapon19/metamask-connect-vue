<template>
  <div class="main">
    <navbar></navbar>
    <BodyDetail></BodyDetail>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import BodyDetail from './components/BodyDetail.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar, BodyDetail
  }
})
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
