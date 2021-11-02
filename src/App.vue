<template>
  <div id="app">
      <router-view  />
  </div>
</template>

<script>
import { connectInfo } from '@/wallet/connect/metaMask'
export default {
  name: 'App',
  // data(){
  //   return {
  //   }
  // },
  // computed:{
  //   key() {
  //     return this.$route.fullPath
  //   }
  // },
  mounted(){
    setTimeout(()=>{
      connectInfo()
    }, 300)
  },
}
</script>

<style>
</style>
