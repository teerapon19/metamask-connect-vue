<template>
  <div class="body-detail">
    <h1>Account: {{account === '' ? 'No account connected': account}}</h1>
    <h1>ChainId: {{ chainId }}</h1>
    <br>
    <h2>Transfer web3 with raw Private key:</h2>
    <div><input v-model="tokenAddress" placeholder="Token address"></div>
    <div><input v-model="privateKey" placeholder="Private key"></div>
    <div><input v-model="transferTo" placeholder="Transfer to"></div>
    <div><input v-model="amount" placeholder="Amount (10^-18)"></div>
    <button @click="transferToken">Transfer</button>
    <div>Status: {{ status }}</div>
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
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '@/assets/erc20.abi.json'

export default defineComponent({
  data: () => {
    return {
      tokenAddress: '',
      privateKey: '',
      transferTo: '',
      amount: '',
      status: {}
    }
  },
  computed: {
    account () {
      return store.state.defaultAccount
    },
    chainId () {
      return store.state.chainId
    }
  },
  methods: {
    async transferToken () {
      const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
      const account = web3.eth.accounts.privateKeyToAccount(this.privateKey)
      web3.eth.accounts.wallet.add(account) // assign account to web3 wallet
      web3.eth.defaultAccount = account.address // set default account
      const contract = new web3.eth.Contract(ERC20ABI as AbiItem[], this.tokenAddress)
      try {
        const result = await contract.methods.transfer(this.transferTo, this.amount).send({
          from: account.address,
          gasPrice: Web3.utils.toWei('10', 'gwei'), // use for fee
          gas: 5000000
        })
        this.status = result
        console.log(result)
      } catch (err) {
        console.log(err)
      }
    }
  }
})
</script>
