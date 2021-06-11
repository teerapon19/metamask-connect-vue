<template>
  <nav>
    <button
      @click="connectMetamask()"
      style="margin-top:18px"
    >
      Connect MetaMask Wallet
    </button>
  </nav>
</template>

<style scoped>
nav {
  width: 100vw;
  height: 70px;
  background-color: chocolate;
  text-align: center;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent } from 'vue'
import store from '@/store'
import detectEthereumProvider from '@metamask/detect-provider'

interface ConnectInfo {
  chainId: string;
}

export default defineComponent({
  name: 'navbar',
  mounted () {
    this.onSetupMetamask()
  },
  methods: {
    connectMetamask: async () => {
      try {
        const provider = await detectEthereumProvider() as any
        if (provider) {
          console.log('Ethereum successfully detected!')
          const accounts = await provider.request({ method: 'eth_requestAccounts' }) // use for request metamask account
          // console.log(accounts)
          if (accounts.length > 0) {
            // get account in array
            // account connect success fully will get array more then 1
            // store account to state
            store.commit('setDefaultAaccount', accounts[0])
          }
        }
      } catch (err) {
        console.error('Connect metamask fail:', err)
      }
    },
    onSetupMetamask: async () => {
      const provider = await detectEthereumProvider() as any

      provider.on('connect', (connectInfo: ConnectInfo) => {
        console.log(connectInfo)
        store.commit('setChainId', connectInfo.chainId)
      })

      // watch when user change account
      provider.on('accountsChanged', (accounts: string[]) => {
        // console.log(accounts)
        if (accounts.length > 0) {
          store.commit('setDefaultAaccount', accounts[0])
        }
      })
    }
  }
})
</script>
