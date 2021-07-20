<template>
  <div class="body-detail">
    <h1>Account: {{account === '' ? 'No account connected': account}}</h1>
    <h1>ChainId: {{ chainId }}</h1>
    <br>
    <h3>Look at console to see other detail</h3>
    <h2>Transfer web3 with raw Private key:</h2>
    <div><input v-model="tokenAddress" placeholder="Token address"></div>
    <div><input v-model="privateKey" placeholder="Private key"></div>
    <div><input v-model="transferTo" placeholder="Transfer to"></div>
    <div><input v-model="amount" placeholder="Amount (10^-18)"></div>
    <button @click="transferToken">Transfer</button>
    <div>Status: {{ status }}</div>

    <br>
    <h1>ERC20 TOKEN EXPLORE</h1>
    <div>
      Token address: <input v-model="tokenAddressExplore" placeholder="Token address"> <button @click="erc20Explore">GET</button>
    </div>
    <div>
      Name: {{ tokenDetail.name }}
    </div>
    <div>
      Symbol: {{ tokenDetail.symbol }}
    </div>
    <div>
      Decimals: {{ tokenDetail.decimals }}
    </div>
    <div>
      TotalSupply: {{ tokenDetail.totalSupply }}
    </div>
    <div>
      Balance: {{ tokenDetail.ownerBalance }} <button @click="getBalance">GET</button>
    </div>
    <br>
    <div>
      <h3>Transfer</h3>
      Transfer to: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.transferTo" placeholder="Transfer to">
      Amount: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.amount" placeholder="Amount (Ether)">
      <button :disabled="!isTokenAddressCorrect" @click="transferMetamask" >Send</button>
    </div>
    <br>
    <div>
      <h3>Approve</h3>
      Spender: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.spenderAddress" placeholder="Spender address">
      Amount: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.spendAmount" placeholder="Amount (Ether)">
      <button :disabled="!isTokenAddressCorrect" @click="approveToken" >Approve</button>
    </div>
    <br>
    <div>
      <h3>Allowance</h3>
      Spender: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.spenderAddress" placeholder="Spender address"> <button @click="getAllowance">GET</button>
      Remaining: {{ tokenDetail.remainingAmount }}
    </div>
    <br>
    <div>
      <h3>TransferFrom</h3>
      Transfer from: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.transferFrom" placeholder="Transfer from">
      Transfer to: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.transferTo" placeholder="Transfer to">
      Amount: <input :disabled="!isTokenAddressCorrect" v-model="tokenDetail.amount" placeholder="Amount (Ether)">
      <button :disabled="!isTokenAddressCorrect" @click="transferFromMetamask" >Send</button>
    </div>
  </div>
</template>

<style>
.body-detail {
  padding-left: 25px;
  padding-right: 25px;
  margin-bottom: 95px;
}
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent } from 'vue'
import store from '@/store'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '@/assets/erc20.abi.json'
import detectEthereumProvider from '@metamask/detect-provider'

export default defineComponent({
  data: () => {
    return {
      tokenAddress: '',
      privateKey: '',
      transferTo: '',
      amount: '',
      status: {},
      provider: {} as any,
      web3: {} as Web3,
      tokenDetail: {
        name: '',
        symbol: '',
        decimals: '',
        totalSupply: '',
        transferTo: '',
        amount: '',
        transferFrom: '',
        ownerBalance: '',
        spenderAddress: '',
        remainingAmount: '',
        spendAmount: ''
      },
      contract: {} as any,
      tokenAddressExplore: '0x178Aa11Ec3320BADE0381572D412D111f6cF043E',
      isTokenAddressCorrect: false
    }
  },
  computed: {
    account: () => {
      return store.state.defaultAccount
    },
    chainId: () => {
      return store.state.chainId
    }
  },
  async mounted () {
    this.provider = await detectEthereumProvider() as any
    this.web3 = new Web3('https://data-seed-prebsc-2-s2.binance.org:8545/')
    this.erc20Explore()
  },
  watch: {
    tokenAddressExplore (val) {
      if (Web3.utils.isAddress(val)) {
        this.erc20Explore()
      } else {
        this.isTokenAddressCorrect = false
      }
    }
  },
  methods: {
    async erc20Explore () {
      if (Web3.utils.isAddress(this.tokenAddressExplore)) {
        this.contract = new this.web3.eth.Contract(ERC20ABI as AbiItem[], this.tokenAddressExplore)
      }
      try {
        if (this.provider) {
          this.tokenDetail.name = await this.contract.methods.name().call({
            from: this.account
          })
          this.tokenDetail.symbol = await this.contract.methods.symbol().call({
            from: this.account
          })
          this.tokenDetail.decimals = await this.contract.methods.decimals().call({
            from: this.account
          })
          const totalSupply = await this.contract.methods.totalSupply().call({
            from: this.account
          })
          this.tokenDetail.totalSupply = Web3.utils.fromWei(totalSupply, 'ether').toString()
          this.isTokenAddressCorrect = true
        }
        this.$forceUpdate()
      } catch (err) {
        this.isTokenAddressCorrect = false
        console.log(err)
      }
    },
    async getBalance () {
      const balance = await this.contract.methods.balanceOf(this.account).call({
        from: this.account
      })
      this.tokenDetail.ownerBalance = Web3.utils.fromWei(balance, 'ether').toString()
    },
    async getAllowance () {
      const remining = await this.contract.methods.allowance(this.account, this.tokenDetail.spenderAddress).call({
        from: this.account
      })
      console.log(remining)
      this.tokenDetail.remainingAmount = remining
    },
    async approveToken () {
      try {
        if (this.provider) {
          const aproveABI = this.contract.methods.approve(this.tokenDetail.spenderAddress, Web3.utils.toWei(this.tokenDetail.spendAmount, 'ether')).encodeABI()
          const tx = await this.provider
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: this.account,
                  to: this.contract.options.address,
                  data: aproveABI
                }
              ]
            })
          console.log(tx)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async transferMetamask () {
      try {
        if (this.provider) {
          const transferMethodABI = this.contract.methods.transfer(this.tokenDetail.transferTo, Web3.utils.toWei(this.tokenDetail.amount, 'ether')).encodeABI()
          const tx = await this.provider
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: this.account,
                  to: this.contract.options.address,
                  data: transferMethodABI
                }
              ]
            })
          console.log(tx)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async transferFromMetamask () {
      try {
        if (this.provider) {
          const transferMethodABI = this.contract.methods.transferFrom(this.tokenDetail.transferFrom, this.tokenDetail.transferTo, Web3.utils.toWei(this.tokenDetail.amount, 'ether')).encodeABI()
          const tx = await this.provider
            .request({
              method: 'eth_sendTransaction',
              params: [
                {
                  from: this.account,
                  to: this.contract.options.address,
                  data: transferMethodABI
                }
              ]
            })
          console.log(tx)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async transferToken () {
      const web3 = new Web3('https://data-seed-prebsc-2-s2.binance.org:8545/')
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
