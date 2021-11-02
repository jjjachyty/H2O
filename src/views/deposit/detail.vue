<template>
    <div class="deposit-detail-page">
        <div class="app-container">

            <div class="kind">
                <img :src="currentTokenImage(name)" >
                <span>{{name}}</span>
            </div>
            <div class="property">
                <div 
                    class="item"
                    v-for="item in propertyList"
                    :key="item.id">
                    <span class="num">{{item.id}}</span>
                    <!-- <span class="name">{{type==='et' ? '取款' : '存款'}}</span> -->
                    <span class="name">{{type==='et' ? 'Withdraw Tokens' : 'Deposit Tokens'}}</span>
                </div>
            </div>
            <p class="title"  >
                <span>{{type==='et' ? 'I’d like to withdraw' : 'I’d like to deposit'}}</span>
                
            </p>
            <!-- <p class="title" v-else>
                <span>我要{{themeText}}</span>
                <button
                    v-for="(item) in days"
                    :key="item.id"
                    :class="['btn' , {'active': activeDayIndex === item.id}]"
                    @click="toggleDays(item)">
                    {{item.name}}
                </button>
            </p> -->

            <div class="input-area">
                <div class="balance">
                    <span class="info">Balance：</span>
                    <!-- <span class="num">{{type === 'et' ? H_tokenBalance  : tokenBalance}} {{tokenKind}}</span> -->
                    <span class="num">{{toFixed(tokenBalance , 6) || '--'}} {{name}}</span>
                </div>
                <div :class="['inputBox' , {'overMax':isConnected&&isOverMax}]">
                    <img :src="currentTokenImage(name)" alt="">
                    <input 
                        type="text"
                        minLength="1"
                        maxLength="79"
                        v-model="depositNum" 
                        @input="inputEvent">
                    <button @click="clickAllBtn">MAX</button>
                </div>
            </div>
            <p 
                class="warn-tips"
                v-show="isConnected&&isOverMax">Sorry, the balance is insufficient</p>
            <div class="receive">
                <p class="tit">You will receive：</p>
                <p class="num">{{depositNum*rewardRate || '--'}} {{subname}}</p>
            </div>
            <!-- <div class="warn" v-if="type==='de'">
                提示：存入后获得计息币，前往质押挖矿页面，质押您的计息币获取质押收益
            </div> -->
            <div class="warn" v-if="type==='de'">
                Notice: remember to stake hToken on 'Stake' page to get H2O staking reward
            </div>
            <div class="submitBtns">
                <button :class="['enter' , {'disabled' : btnDisabled} ]" 
                        :disabled="btnDisabled"
                        @click="submitOrder" 
                        v-loading="GettingApprove" >
                    {{submitBtnText}}
                </button>
                <button class="cancal" @click="returnPage">BACK</button>
            </div>
        </div>
    </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { mapState } from 'vuex'
import { approve , depositPutIn , depositPutOut } from '@/wallet/trade'
import { getBalance , isApproved , getHtokenTotal , getTotalToken } from '@/wallet/Inquire'
import { fromWei } from '@/utils/tools'
export default {
    name:'depositDetail',
    data(){
        return {
            propertyList:[
                {id:1 , name:'币种'},
            ],
            days:[
                {id:1 , name:'30天'},
                {id:2 , name:'60天'},
                {id:3 , name:'90天'},
                {id:4 , name:'180天'},
            ],
            activeDayIndex:4,
            depositNum:'',

            rewardRate:1,

            // 测试
            // isOverMax:true,


            tokenBalance:'--',
            tokenAddress:'',
            originAddress:'',
            name:'',
            subname:'',
            approved:0,
            decimals:18,
            origindecimals:18

        }
    },
    created(){
        try{
            let JsonInfo = sessionStorage.getItem('deInfo') 
            let info = JSON.parse(JsonInfo)
            this.tokenAddress = info.token
            this.originAddress = info.originToken
            this.origindecimals = info.origindecimals
            // 测试

                // this.$store.commit('setDepositCurrent' , this.tokenAddress)

            // ----
            this.decimals = info.decimals
            if(this.type === 'et'){
                this.name = info.name_h
                this.subname = info.name
            }else {
                this.name = info.name
                this.subname = info.name_h
            }
            
        }catch(err){

        }
    },
    mounted(){
    },
    watch:{
        isConnected:{
            immediate:true,
            async handler(val){
                if(val && this.tokenAddress && !this.approve) {
                    this.type !=='et' ? this.getTokenBalanceApprove() : this.getTokenBalance()
                }
            }
        },
        tokenAddress:{
            handler(val){
                if(this.isConnected && val){
                    this.type !=='et' ? this.getTokenBalanceApprove() : this.getTokenBalance()
                }
            }
        }
    },
    computed:{
        btnDisabled(){
            return this.isConnected && !(this.approved === 2 && this.type!=='et')  && !Boolean(Number(this.depositNum)) || this.isOverMax 
        },
        type(){
            return this.$route.query.type
        },
        themeText(){
            return this.type==='et' ? 'Withdraw' : 'Deposit'
        },
        GettingApprove(){
            return this.isConnected && this.approved === 0 
        },
        submitBtnText(){
            return this.isConnected ? ( this.approved === 2 && this.type!=='et' ? 'Approve' : this.themeText) :'Connect Wallet'
        },
        isOverMax(){
            return   (this.tokenBalance === '--' && Number(this.depositNum)) || (this.tokenBalance !== '--' && Number(this.depositNum) > Number(this.tokenBalance) )
        },
        ...mapState({
            isConnected:state=>state.base.isConnected,
            address:state=>state.base.address,
            mainTheme:state=>state.comps.mainTheme,
           
        }),
    },
    methods:{
        inputEvent(e){
            this.depositNum = this.$inputLimit(e , 6 , true)
        },
        toggleDays(item) {
            this.activeDayIndex = item.id
        },
        returnPage(){
            this.depositNum = ''
            this.$router.go(-1)
        },
        submitOrder(){
            if(!this.isConnected) return this.$connect()

            if(this.approved === 2 && this.type  !== 'et'){
                approve(this.tokenAddress)
                .then(()=>{
                    this.approved = 1
                })
                return
            }

            let tradeFunc = this.type === 'et' ? depositPutOut : depositPutIn
            tradeFunc(this.originAddress , this.origindecimals , this.depositNum)
            .finally(()=>{
                this.depositNum = ''
                this.getTokenBalanceApprove(true)
                this.$store.commit('setDepositCurrent' , this.tokenAddress)
            })
        },
        clickAllBtn(){
            if(!this.isConnected || !this.tokenBalance) return 
            this.depositNum = this.tokenBalance
        },
        async getTokenBalanceApprove(bool){
            let balance = await getBalance(this.tokenAddress,this.decimals )
            console.log('balance',balance);
            this.tokenBalance = balance

            if(this.tokenAddress === '0x0000000000000000000000000000000000000000'){
                this.approved = 1
                return
            }

            !bool && isApproved(this.tokenAddress , this.decimals , balance).then(bool=>{
                this.approved = bool ? 1 : 2
            })
        },
        async getTokenBalance(){
            let totalSupply = await getHtokenTotal(this.tokenAddress,this.decimals)

            let totalToken = await getTotalToken(this.originAddress,this.origindecimals)
            if(!isNaN(totalSupply) && !isNaN(totalToken)){
                this.rewardRate = Number(totalToken) / Number(totalSupply)
                console.log('rewardRate' , this.rewardRate);
            }

            let balance = await getBalance(this.tokenAddress,this.decimals )

            console.log('balance',balance);
            this.tokenBalance = balance
            this.approved = 1
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        }

    }
}
</script>
<style lang="scss" scoped>
    .app-container {
        padding: 27px 75px 45px 75px;
        p{
            margin: 0;
        }
        .warn-tips{
            color: #f00;
            font-size: 14px;
            margin-top: 5px;
        }
    }
    .kind {
        padding-bottom: 25px;
        img{
            height: 26px;
            vertical-align: middle;
            position: relative;
            top: -3px;
            margin-right: 12px;
        }
        span {
            font-size: 18px;
            font-weight: 600;
            @include mainFont($color-mainFont-light);
            // color: #1C1C1B;
        }
    }
    .property {
        padding-bottom: 45px;
        .item {
            .num {
                display: inline-block;
                height: 15px;
                line-height: 15px;
                padding: 0 3px;
                font-size: 12px;
                // border: 1px solid #002DFF;
                border-radius: 3px;
                // color: #002DFF;
                @include btnBorderColor($color-btnBorderColor-light);
                margin-right: 17px;
            }
            .name {
                font-size: 15px;
                @include blueFont($blueFont-light);

                // color: #002DFF;
            }
        }
    }
    .title {
        // color: #1C1C1B;
        @include mainFont($color-mainFont-light);
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 22px;
        .btn {
            height: 28px;
            width: 90px;
            line-height: 26px;
            border: 1px solid #333333;
            color: #333333;
            background-color: transparent;
            border-radius: 19px;
            margin-left: 20px;
            vertical-align: middle;
            cursor: pointer;
        }
        .btn.active {
            // border-color: #0031FF;
            // color: #002EFF;
            @include btnBorderColor($color-btnBorderColor-light);

        }
    }
    .input-area {
        .balance {
            font-size: 12px;
            line-height: 12px;
            padding-bottom: 8px;
            text-align: right;
            .info{
                color: #999999;
            }
            .num {
                // color: #333333;
                @include balanceFont($balanceFont-light);
            }
        }
        .inputBox {
            height: 68px;
            background-color: rgba(0, 49, 255 , .06);
            border-radius: 8px;
            position: relative;
            img {
                position: absolute;
                height: 32px;
                width: 32px;
                left: 14px;
                top: 18px;
            }
            button{
                position: absolute;
                height: 38px;
                width: 105px;
                text-align: center;
                line-height: 36px;
                // border: 1px solid #0031FF;
                // color: #002EFF;
            @include btnBorderColor($color-btnBorderColor-light);
                background-color: transparent;
                right: 15px;
                 top: 15px;
                 border-radius: 19px;
                 cursor: pointer;
            }
            input {
                width: 100%;
                height: 68px;
                padding: 0;
                margin: 0;
                border: none;
                outline: none;
                background-color: transparent;
                font-size: 18px;
                @include balanceFont($balanceFont-light);
                padding: 0 120px 0 62px;
                box-sizing: border-box;
            }
            
        }
        .overMax{
            border: 1px solid #f00;
        }
    }
    
    
    .receive {
        padding-top: 29px;
        .tit {
            // color: #1C1C1B;
            font-size: 18px;
            font-weight: 600;
            @include mainFont($color-mainFont-light);
        }
        .num {
            padding-top: 12px;
            padding-bottom: 29px;
            // color: #0031FF;
            @include blueFont($blueFont-light);
            font-size: 26px;
        }
    }
    .warn {
        height: 44px;
        line-height: 44px;
        padding:0 15px;
        background-color: rgba(255, 0, 0 , .06);
        font-size: 14px;
        color: #EE1E1E;
    }
    .submitBtns {
        padding-top: 30px;
        text-align: center;
        button {
            width: 180px;
            height: 38px;
            line-height: 36px;
            // border: 1px solid #0031FF;
            // color: #002EFF;
            @include btnBorderColor($color-btnBorderColor-light);
            @include sideBarBgc($color-bgc-sideBar-light);
            border-radius: 19px;
            // background-color: #fff;
            cursor: pointer;
            position: relative;
            padding: 0;
        }
        .enter {
            background: linear-gradient(90deg, #0096FF, #0024FF);
            border: none;
            color: #fff !important;
            margin-right: 22px;
            height: 40px;
            position: relative;
            overflow: hidden;
            ::v-deep {
                .el-loading-mask{
                    @include loadingMask($loadingMask-light)
                }
                .el-loading-spinner .circular{
                    width: 30px;
                    height: 30px;
                    margin-top: 6px;
                }
            }
        }
        .enter.disabled {
            // content: '';
            // display: block;
            // position: absolute;
            // left: 0;
            // top: 0;
            // right: 0;
            // bottom: 0;
            // background-color: rgba(0,0,0,.4);
            @include enterDisabled($enterDisabled-light);
            // background: #AAAAAA;
            color: #fff;
            cursor: not-allowed;
        }
        
    }
</style>