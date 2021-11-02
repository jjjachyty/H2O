<template>
    <div class="sidebar-container">
        <div class="sider-inner">

        <div class="logo">
            <router-link to="/" class="logo-link">
                <img src="@/assets/h2oToken.png" alt="" v-if="mainTheme==='light'">
                <img src="@/assets/h2oToken_dark.png" alt="" v-else>
                <br>
                <span>
                    H2O
                    Finance
                </span>
            </router-link>
        </div>
        <div class="menu">
            
        
            <ul class="menulist">
                <li :class="[ 'item' , {'active':currentPath === '/deposit'}]">
                    <router-link to="/deposit"  tag="div" class="menuLink">
                        <i class="menu-icon deposit"></i>
                        <!-- <span >单币存款</span> -->
                        <span >Vault</span>
                    </router-link>
                </li>
                <li :class="[ 'item' , {'active':currentPath === '/pledgeMint'}]">
                    <router-link to="/pledgeMint" tag="div" class="menuLink">
                        <i class="menu-icon pledge"></i>
                        <!-- <span >质押挖矿</span> -->
                        <span >Stake</span>
                    </router-link >
                </li>
                <li :class="[ 'item' ]">
                    <div @click="toggleSubmenu">
                        <i class="menu-icon lever"></i>
                        <!-- <span>杠杆挖矿</span> -->
                        <span>Farm</span>
                    </div>
                </li>
                <li class="subMenu">
                    <transition name="slide-fade">
                        <ul v-show="showSubMenu">
                            <li :class="[ 'item' , {'active':currentPath === '/totalMinting'}]">
                                <router-link to="/totalMinting" tag="div" class="menuLink">
                                    <span class="subPoint"></span>
                                    <!-- 全部挖矿 -->
                                    All Farms
                                </router-link >
                            </li>
                            <li :class="[ 'item' , {'active':currentPath === '/position'}]">
                                <router-link to="/position" tag="div" class="menuLink">
                                    <span class="subPoint"></span>
                                    <!-- 我的持仓 -->
                                    My Positions
                                </router-link >
                            </li>
                            <li :class="[ 'item' , {'active':currentPath === '/Liquidation'}]">
                                <router-link to="/Liquidation" tag="div" class="menuLink">
                                    <span class="subPoint"></span>
                                    <!-- 清算列表 -->
                                    Liquidation
                                </router-link >
                            </li>
                        </ul>
                    </transition>
                </li>
                <li :class="[ 'item' , {'active':currentPath === '/Claim'}]">
                    <router-link to="/Claim" tag="div" class="menuLink">
                        <i class="menu-icon flag"></i>
                        <!-- <span >收获</span> -->
                        <span >Harvest</span>
                    </router-link >
                </li>
            </ul>
        
        </div>
        <div class="bottomArea">
            <div class="exchange">
                <div class="item balance">
                    <img src="@/assets/h2oToken.png" alt="" v-if="mainTheme==='light'">
                    <img src="@/assets/h2oToken_dark.png" alt="" v-else>
                    <span>$ 100.68</span>
                </div>
                <!-- <div class="item active">
                    <img src="@/assets/token.png" alt="">
                    <span> Buy H2O</span>
                </div> -->
                <!-- <div class="item">
                    <img src="@/assets/m_token.png" alt="">
                    <span> Buy H2O</span>
                </div>
                <div class="item">
                    <img src="@/assets/pancake.png" alt="">
                    <span> Buy H2O</span>
                </div> -->
                <div class="item">
                    <img src="@/assets/mm_token.png" alt="">
                    <span>CoinMarketCap</span>
                </div>
                <div class="item">
                    <img src="@/assets/gecko.png" alt="">
                    <span>CoinGecko</span>
                </div>
            </div>
            <div class="Social">
                <div class="item">
                    <img src="@/assets/twitter.png" alt="">
                </div>
                <div class="item">
                    <img src="@/assets/tele.png" alt="">
                </div>
                <div class="item">
                    <img src="@/assets/disc.png" alt="">
                </div>
                <div class="item">
                    <img src="@/assets/Social1.png" alt="">
                </div>
                <div class="item">
                    <img src="@/assets/Social2.png" alt="">
                </div>
                <div class="item">
                    <img src="@/assets/Social3.png" alt="">
                </div>
            </div>
        </div>
        <div class="fixAbs"></div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
    export default {
        name: 'LayoutSidebar',
        data(){
            return {
                showSubMenu:false,
                // currentPath:''
            }
        },
        mounted(){
            console.log('currentPath' , this.currentPath);
        },
        computed:{
            currentPath(){
                return this.$route.path
            },
            ...mapState({
                mainTheme:state=>state.comps.mainTheme
            })
        },
        methods:{
            handleOpen(key, keyPath){
                console.log(key, keyPath);
            },
            handleClose(){
                
            },
            toggleSubmenu(){
                this.showSubMenu = !this.showSubMenu
            }
        }
    }
</script>
<style lang="scss" scoped>


.menu {
    padding: 0 45px ;
    margin-top: 36px;
    .menuLink {
        display: block;
        color: inherit;
    }
    .menulist{
        padding: 0;
        margin: 0;
        li{
            list-style: none;
            padding-left: 44px;
            cursor: pointer;
            height: 38px;
            margin-bottom: 8px;
            color: #333333;
            font-size: 14px;
            position: relative;
            line-height: 38px;
            border-radius: 19px;
           
            .menu-icon{
                position: absolute;
                height: 14px;
                width: 20px;
                left: 21px;
                top: 12px;
            }
            .deposit {
                background:  url('~@/assets/deposit.png') no-repeat;
                background-size: contain;
            }
            .pledge {
                background: url('~@/assets/pledge.png') no-repeat;
                background-size: contain;
            }
            .lever {
                background: url('~@/assets/lever.png') no-repeat;
                background-size: contain;
            }
            .flag {
                background: url('~@/assets/flag.png') no-repeat;
                background-size: contain;
            }
        }
        .item {
            @include mainFont($color-mainFont-light);

        }
        .item.active{
            background:linear-gradient(90deg, #0096FF, #0024FF);
            color: #fff;
            .subPoint{
                background-color: #fff;
            }
            .deposit {
                background:  url('~@/assets/deposit_light.png') no-repeat;
                background-size: contain;
            }
            .pledge {
                background: url('~@/assets/pledge_light.png') no-repeat;
                background-size: contain;
            }
            .lever {
                background: url('~@/assets/lever_light.png') no-repeat;
                background-size: contain;
            }
            .flag {
                background: url('~@/assets/flag_light.png') no-repeat;
                background-size: contain;
            }
        }
        .item:not(.active):hover{
            color: #002CFF;
            .subPoint{
                background-color: #002CFF;
            }
        }
        .subMenu{
            padding: 0;
            height: auto;
            padding-left: 16px;
            .item{
                font-size: 12px;
                @include mainFontSubNav($color-mainFontSubNav-light)
            }
            .item.active{
                color: #fff;
            }
            ul{
                padding: 0;
            }
            .subPoint{
                position: absolute;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color:#333333;
                left: 27px;
                top: 16.5px;
            }   
        }
    }
}
.logo {
    height: 53px;
    box-sizing: border-box;
    .logo-link {
        display: block;
        height: 100%;
        text-align: center;

        img{
            height: 53px;
            margin-left: -24px;
        }
        span {
            display: inline-block;
            font-size: 16px;
            @include mainFont($color-mainFont-light);
            // color: #1C1C1B;
            padding-top: 4px;
            margin-left: -14px;
        }
    }
}
.bottomArea {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 30px;
    .Social {
        display: flex;
        padding: 0 50px ;
        justify-content: space-between;
        margin-top:16px;
        .item {
            cursor: pointer;
            img {
                height: 14px;
            }
        }
    }
    .exchange {
        padding: 0 45px;
        .item {
            height: 38px;
            line-height: 38px;
            margin: 4px 0;
            border-radius: 19px;
            font-size: 14px;
            @include otherFont($color-otherFont-light);

            // color: #333333;
            cursor: pointer;
            img{
                height: 23px;
                width: 23px;
                margin: 0 9px 0 18px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .item.active {
            @include exchangeBgc($color-exchange-activeBg-light);
            // background: rgba(245, 246, 250,0.96);
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.14);
            @include activeFont($color-activeFont-light);
            
        }
        .item.balance{
            @include mainFont($color-mainFont-light);
        }
    }
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

</style>