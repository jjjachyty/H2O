<template>
    <div class="dialog-outer">
        <div class="container">
            <div class="title">
                <span>{{kind === 'redeem'? 'Redeem' : 'Margin call '+info.name0+'/'+info.name1}}</span>
                <div class="close" @click="closeDialog">
                    <img src="@/assets/close.png" alt="">
                </div>
            </div>
            <div class="coinList" v-if="kind === 'coverup'">
                <div class="item">
                    <p class="balance">
                        <span 
                            class="balaLack"
                            v-if="Number(token0Num) > Number(balance0||0)">
                            Sorry, the balance is insufficient
                        </span>
                        <span class="tit">Balance：</span>
                        <span class="num">{{balance0}} {{info.name0 || '--'}}</span>
                    </p>
                    <div class="sele-area">
                        <img :src="currentTokenImage(info.name0)" alt="">
                        <input 
                                type="text"
                                minLength="1"
                                maxLength="79"
                                v-model="token0Num" 
                                @input="inputEvent($event , 'token0Num')">
                        <div class="kind">{{info.name0 || '--'}}</div>
                    </div>
                    <div class="btn-area">
                            <div 
                                v-for="(item) in btnsList "
                                :key="item.val"
                                :class="['btn',{'active':token0ActivePer === item.val}]"
                                @click="perBalanceClick(0,item.val)">
                                {{item.label}}
                            </div>
                    </div>
                </div>
                <div class="item">
                    <p class="balance">
                        <span 
                            class="balaLack"
                            v-if="Number(token1Num) > Number(balance1||0)">
                            Sorry, the balance is insufficient
                        </span>
                        <span class="tit">Balance：</span>
                        <span class="num">{{balance1}} {{info.name1 || '--'}}</span>
                    </p>
                    <div class="sele-area">
                        <img :src="currentTokenImage(info.name1)" alt="">
                        <input 
                                type="text"
                                minLength="1"
                                maxLength="79"
                                v-model="token1Num" 
                                @input="inputEvent($event , 'token1Num')">
                        <div class="kind">{{info.name1 || '--'}}</div>
                    </div>
                    <div class="btn-area">
                        <!-- <div class="btn active">25%</div>
                        <div class="btn">50%</div>
                        <div class="btn">75%</div>
                        <div class="btn">100%</div> -->
                        <div 
                            v-for="(item) in btnsList "
                            :key="item.val"
                            :class="['btn',{'active':token0ActivePer === item.val}]"
                            @click="perBalanceClick(1,item.val)">
                            {{item.label}}
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="tradeInfo coverup" v-if="kind === 'coverup'">
                <div class="info">
                    <span class="tit">Assets to be Added to Position</span>
                    <span class="cnt">{{toFixed(token0Num || 0 , 6)}} {{info.name0 || '--'}} + {{toFixed(token1Num || 0 , 6)}} {{info.name1 || '--'}}</span>
                </div>
            </div>
            <!-- <div class="warnTips" v-if="kind === 'redeem'">
                <img src="@/assets/warn-icon.png" alt="">
                <span>我们将把所需的最低数量的代币转换为BUSD以偿还债务并将剩余资产退还给您。这可能会节省滑点和交易费用。</span>
            </div> -->
            <div class="btns" v-if="kind === 'redeem'">
                <!-- <div class="item active">
                    最优方案
                </div>
                <div class="item">
                    BNB
                </div>
                <div class="item">
                    BUSD
                </div> -->
                <div :class="['item' , {'active':redeemActive === item.id}]"
                     v-for="item in redeemBtn"
                     :key="item.id"
                     @click="redeemActive = item.id">
                    {{item.label}}
                </div>
            </div>
            <div class="mainInfo" v-if="kind === 'coverup'">
                <div class="item">
                    <span class="tit">Updated Assets in Position Value</span>
                    <span class="cnt">{{toFixed(info.amount.userToken0, 6)}} {{info.name0 || '--'}} / {{toFixed(info.amount.userToken1, 6)}} {{info.name1 || '--'}}</span>
                </div>
                <div class="item">
                    <!-- <span class="tit">交易金额</span> -->
                    <span class="tit">Risk value before margin call</span>
                    <span class="cnt">{{currentRisk}}%</span>
                </div>
                <div class="item">
                    <span class="tit">Risk value after margin call</span>
                    <span class="cnt">{{afterCoverUpRisk}}%</span>
                </div>
            </div>
            <!-- <div class="tradeInfo" v-if="kind === 'redeem'">
                <div class="info">
                    <span class="tit">预计可赎回</span>
                    <span class="cnt">{{redeem.userToken1}} {{info.name0 || '--'}} + {{redeem.userToken0}} {{info.name1 || '--'}}</span>
                </div>
                <p class="tips">(价格波动、手续费、滑点的实时变化，影响实际到账数量)</p>
            </div> -->

            <div class="mainInfo" v-if="kind === 'redeem'">
                <div class="item">
                    <span class="tit">Redemption of liquid assets</span>
                    
                    <span class="cnt" v-if="redeemActive === '2'">
                        {{toFixed(info.amount.userToken0 , 6)}} {{info.name0 || '--'}} / {{toFixed(info.amount.userToken1 , 6)}} {{info.name1 || '--'}}
                    </span>
                    <span class="cnt" v-else-if="redeemActive === '1'">
                        {{toFixed(info.amount.token0Total , 6)}} {{info.name0 || '--'}}
                    </span>
                    <span class="cnt" v-else>
                        {{toFixed(info.amount.token1Total, 6)}} {{info.name1 || '--'}}
                    </span>
                </div>
                <div class="item">
                    <!-- <span class="tit">交易金额</span> -->
                    <span class="tit">Transaction amount</span>
                    <span class="cnt"  v-if="redeemActive === '2'">{{toFixed(info.amount.tradeAmount, 6)}} {{info.name0 || '--'}}</span>
                    <span class="cnt"   v-else-if="redeemActive === '1'">{{toFixed(TransactionAmount0, 6)}} {{info.name0 || '--'}}</span>
                    <span class="cnt"   v-else>{{toFixed(TransactionAmount1, 6)}} {{info.name0 || '--'}}</span>
                </div>
                <div class="item">
                    <span class="tit">Debt Value</span>
                    <span class="cnt">{{toFixed(info.amount.debtToken/info.amount.token2TokenPrice, 6)}} {{info.name0 || '--'}}</span>
                </div>
            </div>
            <div class="tradeInfo" v-if="kind === 'redeem'">
                <div class="info">
                    <span class="tit">You will receive approximately</span>
                    <!-- <span class="cnt">{{info.amount.userToken0}} {{info.name0 || '--'}} + {{info.amount.userToken1}} {{info.name1 || '--'}}</span> -->
                    <span class="cnt" v-if="redeemActive === '2'">
                        {{toFixed(redeemReceiveToken0, 6)}} {{info.name0 || '--'}} / {{toFixed(redeemReceiveToken1, 6)}} {{info.name1 || '--'}}
                    </span>
                    
                    <!-- <span class="cnt" v-else-if="redeemActive === '1'">
                        {{toFixed(info.amount.token0Total, 6)}} {{info.name0 || '--'}}
                    </span> -->
                    <span class="cnt" v-else-if="redeemActive === '1'">
                        {{toFixed(redeem1Receive0, 6)}} {{info.name0 || '--'}}
                    </span>
                    <!-- <span class="cnt" v-else>
                        {{toFixed(info.amount.token1Total, 6)}} {{info.name1 || '--'}}
                    </span> -->
                    <span class="cnt" v-else>
                        {{toFixed(redeem2Receive0, 6)}} {{info.name1 || '--'}}
                    </span>
                </div>
                <!-- <p class="tips">(价格波动、手续费、滑点的实时变化，影响实际到账数量)</p> -->
            </div>
            <div class="confirmBtn" v-if="kind === 'coverup'">
                <button :class="['enter', {'disabled' : btnDisabled}]" 
                        :disabled="btnDisabled"
                        @click="coverUpClick"
                        v-loading="btnLoading">
                    {{btnTextInfo}}
                </button>
            </div>
            
            <div class="confirmBtn" v-else>
                <button class="enter" 
                        @click="redeemClick"
                        v-loading="btnLoading">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { 
    getBalance  , 
    isApproved , 
    getToken2TokenPrice , 
    getUserPosition , 
    getRedeemLiquidity,
    getRedeemLiquidityShares,
    getLptoken,
    getLptokenTotalSupply,
    getLptokenReserves
} from '@/wallet/Inquire'
import { mintWork , approve , RedeemWork} from '@/wallet/trade'
import imagePointer from '@/utils/images'
import Address from '@/wallet/address.json'
import {  fromWei , toWei } from '@/utils/tools'
import { mapState } from 'vuex'
export default {
    name:'positionDialog',
    props:{
        show:Boolean,
        kind:{
            type:String,
            default:'redeem'
        },
        info:{
            type:Object,
            default:()=>{return {}}
        }
    },
    data(){
        return {
            btnLoading:true,
            btnsList:[
                {label:'25%' , val:25},
                {label:'50%' , val:50},
                {label:'75%' , val:75},
                {label:'100%' , val:100},
            ],
            token0ActivePer:0,
            token1ActivePer:0,
            token0Num:'',
            token1Num:'',


            balance0:'--',
            balance1:'--',

            approve0:false,
            approve1:false,
            tokenToTokenPrice:1,
            posid:'',

            redeemActive:'2',
            redeemBtn:[
                {label:'Optimal',id:"2"},
            ],
            redeem:{
                userToken0:'--',
                userToken1:'--',
                debtToken:'--',
                tradeAmount:'--'
            }
        }
    },
    async created(){
        // this.posid = await getUserPosition(0)
        const { name0 , name1 ,  token0 , token1} = this.info
        if(this.kind === 'coverup'){
            this.getTokenInfo()
        }else {
            if(name0){
                this.redeemBtn.push({label:name0 , id:'1'})
            }
            if(name1){
                this.redeemBtn.push({label:name1 , id:'0'})
            }
            this.btnLoading =false

        }
        this.tokenToTokenPrice = await getToken2TokenPrice(token0,token1 ,this.info.type)
        // this.getRedeemInfo()
        console.log('token2TokenPrice',this.info );

    },
   
    computed:{
        
        btnDisabled(){
            return this.approve0 && this.approve1 && (!Number(this.token0Num)&&!Number(this.token1Num) || Number(this.token0Num) > Number(this.balance0) || Number(this.token1Num)>Number(this.balance1) )
        },
        btnTextInfo(){
            if(!this.approve0){
                return 'Approve ' + this.info.name0
            }
            if(!this.approve1){
                return 'Approve ' + this.info.name1
            }

            return 'Margin call'
        },
        ...mapState({
            mainTheme:state=>state.comps.mainTheme,
        }),
        borrowToken1(){
            return (Number(this.token0Num)*this.tokenToTokenPrice + Number(this.token1Num))
        },
        borrowToken0(){
            return this.tokenToTokenPrice === '0' ? Number(this.token0Num): (Number(this.token0Num) + Number(this.token1Num)/this.tokenToTokenPrice)
        },
        currentRisk(){
            let token1Total  = this.info.amount.token1Total 
            return this.toFixed(this.info.amount.debtToken / token1Total *100, 2)
        },
        afterCoverUpRisk(){
            let token1Total  = this.info.amount.token1Total 
            return this.toFixed(this.info.amount.debtToken/(this.borrowToken1 + token1Total)*100 , 2)
        },
        redeemReceiveToken0(){
            let receive = 0
            const { userToken0 ,  debtToken , token2TokenPrice}  = this.info.amount
            if( Number(userToken0) >=  Number(debtToken/token2TokenPrice) ){
                receive = Number(userToken0)  - Number(debtToken/token2TokenPrice)
            }
            return receive
        },
        redeemReceiveToken1(){
            let receive = 0
            const { tradeAmount , userToken1 , token2TokenPrice}  = this.info.amount
            if(Number(tradeAmount) === 0){
                receive = userToken1
            }else {
                receive =  Number(userToken1) - Number(tradeAmount)*Number(token2TokenPrice)
            }
            if(receive < 0) receive = 0
            return receive
        },
        redeem1Receive0(){
            let receive = 0
            const { token0Total ,   debtToken , token2TokenPrice }  = this.info.amount
            receive = Number(token0Total)  -  Number(debtToken/token2TokenPrice) 
            if(receive < 0) receive = 0
            return receive
        },
        redeem2Receive0(){
            let receive = 0
            const { token1Total ,   debtToken , token2TokenPrice }  = this.info.amount
            receive = Number(token1Total)  -  Number(debtToken) 
            if(receive < 0) receive = 0
            return receive
        },
        TransactionAmount0(){
            let amount = 0
            const { token0Total ,   debtToken , token2TokenPrice }  = this.info.amount
            if(Number(token0Total)  <  Number(debtToken/token2TokenPrice) ){
                amount =  Number(debtToken/token2TokenPrice) - Number(token0Total)
            }
            if(amount < 0) amount = 0

            return amount
        },
        TransactionAmount1(){
            let amount = 0
            const { token1Total ,   debtToken , token2TokenPrice }  = this.info.amount
            if(Number(token1Total)  <  Number(debtToken*token2TokenPrice) ){
                amount =  Number(debtToken*token2TokenPrice) - Number(token1Total)
            }
            if(amount < 0) amount = 0

            return amount
        }
    },
    methods:{
        
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        closeDialog(){
            this.$emit('update:show' , false)
        },
        perBalanceClick(type , val){
            if(type === 0){
                this.token0Num = this.toFixed(this.balance0*val/100 , 6)
                this.token0ActivePer = val
            }else if(type === 1){
                this.token1Num = this.toFixed(this.balance1*val/100 , 6)
                this.token1ActivePer = val
            }
        },
        inputEvent(e , pointer){
            this[pointer] = this.$inputLimit(e , 6 , true)
            let balance = 0
            switch (pointer){
                case 'token0Num' :
                    balance = this.balance0
                    this.token0ActivePer = Number(this[pointer]) / balance * 100
                    break;
                case 'token1Num':
                    balance = this.balance1
                    this.token1ActivePer = Number(this[pointer]) / balance * 100
                    break;
            }

        },
        async getTokenInfo(){
            const { token0 , token1, decimals0, decimals1 , strategyAdd} = this.info
            if(token0) {
                let balance0 = await getBalance(token0 ,decimals0)
                this.balance0 = this.toFixed(balance0 , 6)
                this.approve0 = await isApproved( token0,decimals0 ,balance0 ,strategyAdd )
            }
            if(token1){
                let balance1 = await getBalance(token1 ,decimals1)
                this.balance1 = this.toFixed(balance1 , 6)
                this.approve1 = await isApproved( token1,decimals1 ,balance1 ,strategyAdd )
            }
            this.tokenToTokenPrice = await getToken2TokenPrice(token0,token1 , this.info.type)
            this.btnLoading = false
        },
        async getRedeemInfo(){
            // const { posId , goblin , decimals0 , decimals1 , positionsValue} = this.info
            // let shares = await getRedeemLiquidityShares(goblin , posId)
            // let liquidity = await getRedeemLiquidity(goblin , shares , decimals0)
            // let lptoken = await getLptoken(goblin)
            // let totalSupply = await getLptokenTotalSupply(lptoken , decimals0)
            // let balance = await getLptokenReserves(lptoken , decimals0 , decimals1 )


            // const { amount0 , amount1 } = balance
            // this.redeem.userToken0 = this.toFixed(amount0*liquidity/totalSupply , 6)
            // this.redeem.userToken1 = this.toFixed(amount1*liquidity/totalSupply , 6)
            // this.redeem.debtToken = this.toFixed(fromWei(positionsValue , decimals1) , 6)

            // let tdnum = this.redeem.debtToken - this.redeem.userToken1
            // this.redeem.tradeAmount = tdnum >= 0 ? this.toFixed(tdnum , 6): this.toFixed(0 , 6)
            // this.btnLoading =false






        },
        coverUpClick(){
            const {token0 , token1 , decimals0 , decimals1 , strategyAdd ,posId}  = this.info
            if(!this.approve1) {
                approve(token1 , strategyAdd)
                .then(()=>{
                    this.approve1 = true
                })
                return
            }

            if(!this.approve0) {
                approve(token0 , strategyAdd)
                .then(()=>{
                    this.approve0 = true
                })
                return
            }
            this.btnLoading = true

            mintWork(token0 , token1   ,this.token0Num||0,  this.token1Num||0 , decimals0 , decimals1 , 0 , posId , 0 , strategyAdd)
            .finally(()=>{
                this.btnLoading = false
                this.$emit('update:show' , false)
            })
        },
        redeemClick(){
            this.btnLoading = true
            const {token0 , token1 , posId ,Withdraw , borrowToken}  = this.info
            let borrow = borrowToken === token0 ? token0 :token1
            let origin = borrowToken === token0 ? token1 :token0
            RedeemWork(borrow , origin , this.redeemActive , posId , Withdraw)
            .finally(()=>{
                this.btnLoading = false
                this.$emit('update:show' , false)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-outer{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    background-color:rgba(0,0,0,.5);
    .container{
        width: 770px;
        padding: 30px;
        padding-bottom: 16px;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50% , -50%);
        background-color: #fff;
        border-radius: 38px;
        @include sideBarBgc($color-bgc-sideBar-light) ;
        .coinList {
            .item {
                padding-top: 24px;
                .balance {
                    margin: 0;
                    text-align: right;
                    font-size: 12px;
                    .tit {
                        color: #999999;
                    }
                    .num {
                        // color: #1C1C1B;
                        @include mainFont ($color-mainFont-light)
                    }
                    span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .balaLack{
                        display: inline-block;
                        color: #f00;
                        font-size: 16px;
                        margin-right: 20px;
                        font-weight: 600;
                        vertical-align: middle;
                    }
                }
                .sele-area {
                    padding: 20px 15px;
                    background-color: rgba(0, 49, 255 , .06);
                    border-radius: 8px;
                    margin-top: 8px;
                    line-height: 30px;
                    img {
                        height: 30px;
                        vertical-align: middle;
                        margin-right: 16px;
                    }
                    .num {
                        display: inline-block;
                        vertical-align: middle;
                        font-size: 18px;
                        color: #333333;
                    }
                    .kind {
                        float: right;
                        font-size: 18px;
                        color: #999999;
                    }
                    input {
                        width: calc(100% - 120px);
                        height: 30px;
                        padding: 0;
                        margin: 0;
                        border: none;
                        outline: none;
                        background-color: transparent;
                        font-size: 18px;
                        color: #333333;
                        // padding: 0 120px 0 62px;
                        box-sizing: border-box;
                        vertical-align: middle;
                    }
                }
                .btn-area {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 12px;
                    .btn {
                        width: 150px;
                        height: 36px;
                        // border: 1px solid #333333;
                        // color: #333333;
                        border-style: solid;
                        border-width: 1px;
                        text-align: center;
                        line-height: 36px;
                        border-radius: 19px;

                        @include commonbtn($commonbtn-light);
                    }
                    .btn.active {
                        border: 1px solid #0031FF;
                        color: #0031FF;
                    }
                }
            }
        }
        .title{
            @include mainFont($color-mainFont-light);
            font-size: 17px;
            font-weight: bold;
            .close{
                height: 23px;
                width: 23px;
                float: right;
                cursor: pointer;
                img{
                    height: 23px;
                    width: 23px;
                }
            }
        }
        .warnTips{
            margin-top: 26px;
            line-height: 44px;
            border-radius: 8px;
            background-color: rgba(255, 0, 0 , 0.06);
            font-size: 13px;
            padding: 0 15px ;
            img {
                height: 14px;
                vertical-align: middle;
                margin-right: 8px;
            }
            span {
                display: inline-block;
                vertical-align: middle;
                color: #EE1E1E;
            }
        }
        .btns {
            padding: 23px 0;
            display:flex;
            .item {
                cursor: pointer;
                padding: 0 42px;
                height: 36px;
                line-height: 36px;
                // border: 1px solid #333333;
                border-style: solid;
                border-width: 1px;
                border-radius: 19px;
                margin-right: 8px;
                // color: #333333;
                @include commonbtn($commonbtn-light);
            }
            .item.active{
                border: 1px solid #0031FF;
                color: #0031FF;
            }
        }
        .mainInfo {
            padding: 22px;
            background-color: rgba(0,0,0,0.06);
            border-radius: 8px;
            font-size: 14px;
            .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 14px;
                .tit {
                    color: #666666;
                }
                .cnt {
                    color: #1C1C1B;
                    @include mainFont ($color-mainFont-light)
                }
            }
            .item:nth-last-of-type(1){
                margin-bottom: 0;
            }
        }
        .tradeInfo {
            margin-top: 15px;
            .info{
                display: flex;
                justify-content: space-between;
                .tit {
                    font-size: 17px;
                    color: #1C1C1B;
                }
                .cnt {
                    font-size: 17px;
                    color: #002AFF;
                    font-weight: 600;
                }
            }
            .tips {
                margin: 0;
                padding-top: 8px;
                font-size: 14px;
                color: #999999;
            }
        }
        .tradeInfo.coverup {
            margin-bottom: 16px;
            margin-top: 24px;
        }
        .confirmBtn {
            padding-top: 16px;
            display: flex;
            justify-content: center;
            .enter {
                width: 180px;
                height: 38px;
                line-height: 38px;
                text-align: center;
                background: linear-gradient(90deg, #0096FF, #0024FF);
                border-radius: 19px;
                font-size: 17px;
                color: #fff;
                cursor: pointer;
                outline: none;
                border:none;
                position: relative;
                ::v-deep {
                    .el-loading-mask{
                        background-color: rgba(255,255,255,.8);
                    }
                    .el-loading-spinner .circular{
                        width: 30px;
                        height: 30px;
                        margin-top: 6px;
                    }
                }
            }
            .enter.disabled {
                background: #AAAAAA;
                color: #fff;
                cursor: not-allowed;
            }
        }
    }
}
</style>