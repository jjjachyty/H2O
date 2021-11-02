<template>
    <div class="headerNav-container">
        <div class="totalMintNav" v-if="isTotalMintPath">
            <div class="item" @click="changeMintNav('All')" :class="{'active':activeMintNav === 'All'}">All</div>
            <div class="item" @click="changeMintNav('PS')" :class="{'active':activeMintNav === 'PS'}">PancakeSwap</div>
            <div class="item" @click="changeMintNav('MDEX')" :class="{'active':activeMintNav === 'MDEX'}">MDEX</div>
        </div>
        <div class="receive-airdrop" @click="toAirdrop">
            <img src="@/assets/airdrop_menu.png" alt="">
            Airdrop
        </div>
        <div class="main-theme" @click="changeTheme">
            <img src="@/assets/theme.png" alt="" v-if="activeTheme==='light'">
            <img src="@/assets/daily_icon.png" alt="" v-else>
        </div>
        <!-- <div class="switchLang">
            <div @click="changeLang('zh')" :class="{'activeCN':activeLang === 'zh'}">中文</div>
            <div @click="changeLang('en')" :class="{'activeEN':activeLang === 'en'}">EN</div>
            <span class="bar"></span>
        </div> -->
        <div class="connectWallet pending" v-if="isConnected && pendingOrderAmount" >
            <span>trading</span>
            <img src="@/assets/shuaxin.png" alt="">
          </div>
        <div class="connectWallet" @click="connectWallet" v-else>
            {{isConnected ? addressStr: 'Connect Wallet' }}
        </div>
    </div>
</template>
<script>
import { connectInfo , connect } from '@/wallet/connect/metaMask'
import { mapGetters, mapState } from "vuex";
export default {
    name:'headerNav',
    data(){
        return {
            activeLang:'en',
            activeTheme:'light',
            activeMintNav:'All'
        }
    },
    computed:{
        ...mapState({
            address:state=>state.base.address,
            isConnected:state=>state.base.isConnected,

        }),
        ...mapGetters(['pendingOrderAmount']),
        addressStr(){
            return this.address.substring(0, 4) + "***" + this.address.substring(this.address.length - 3)
        },
        isTotalMintPath(){
            return this.$route.path === '/totalMinting'
        }
    },
    created(){
        // document.documentElement.setAttribute( "data-theme", 'dark' )
        let theme  = localStorage.getItem('theme')
        if(theme === 'light' || theme === 'dark'){
            this.activeTheme = theme
            document.documentElement.setAttribute( "data-theme", theme )
        }
    },
    methods:{
        connectWallet(){
            // if (window.ethereum.isMetaMask) {
            //     connect();
            // } else {
            //     alert("您未安装MetaMask")
            // }
            if(this.isConnected) return 
            this.$connect()
        },
        changeLang(lang){
            this.activeLang = lang
        },
        toAirdrop(){
            this.$router.push({path:'/airdrop' })
        },
        changeTheme(){
            this.activeTheme = this.activeTheme === 'light' ? 'dark' : 'light'
            this.$store.commit('setMainTheme', this.activeTheme)
            localStorage.setItem('theme', this.activeTheme)
            document.documentElement.setAttribute( "data-theme", this.activeTheme )
        },
        changeMintNav(val){
            this.activeMintNav = val
            this.$store.commit('setMintTopNavCurrent' , val)
        }
    }
}
</script>
<style lang="scss" scoped>
.totalMintNav{
    margin-right: auto;
    padding-left: 60px;
    display: flex;
    .item{
        width: 120px;
        margin-right: 8px;
        height: 63px;
        line-height: 63px;
        text-align: center;
        border-bottom: 2px solid transparent;
        box-sizing: border-box;
        cursor: pointer;
    }
    .active {
        color: #002EFF;
        font-weight: bold;
        border-color: #002EFF;
    }
}
</style>