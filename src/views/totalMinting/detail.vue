<template>
    <div class="mintDetail-page">
        <div class="app-container">
            <div class="title">
                <img :src="currentTokenImage(tokenInfo.name0)" alt="" >
                <img :src="currentTokenImage(tokenInfo.name1)" alt="" class="img2">
                <span>{{tokenInfo.name0 + '-' + tokenInfo.name1}}</span>
            </div>
            <div class="infoBar">
                <div class="content">
                    <div class="item">
                        <div class="num">1</div>
                        <p>Approve Assets</p>
                    </div>
                    <div class="item">
                        <div class="num">2</div>
                        <p>Strategy Setting</p>
                    </div>
                    <div class="item">
                        <div class="num">3</div>
                        <p>Start Farming</p>
                    </div>
                </div>
                <div class="progressbar"></div>
            </div>
            <div class="seleArea">
                <div class="title">I’d like to supply</div>
                <div class="coinList">
                    <div class="item">
                        <p class="balance">
                            <span 
                                class="balaLack"
                                v-if="Number(token0Num) > tokenInfo.balance0">Sorry, the balance is insufficient</span>
                            <span class="tit">Balance：</span>
                            <span class="num">{{toFixed(tokenInfo.balance0 ,6) || '--'}} {{tokenInfo.name0}}</span>
                        </p>
                        <div class="sele-area">
                            <img :src="currentTokenImage(tokenInfo.name0)" alt="">
                            <input 
                                type="text"
                                minLength="1"
                                maxLength="79"
                                v-model="token0Num" 
                                @input="inputEvent($event , 'token0Num')">
                            <div class="kind">{{tokenInfo.name0}}</div>
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
                                @click="perBalanceClick(0,item.val)">
                                {{item.label}}
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <p class="balance">
                            <span 
                                class="balaLack"
                                v-if="Number(token1Num) > tokenInfo.balance1">Sorry, the balance is insufficient</span>
                            <span class="tit">Balance：</span>
                            <span class="num">{{toFixed(tokenInfo.balance1,6) || '--'}} {{tokenInfo.name1}}</span>
                        </p>
                        <div class="sele-area">
                            <img :src="currentTokenImage(tokenInfo.name1)" alt="">
                            <input 
                                type="text"
                                minLength="1"
                                maxLength="79"
                                v-model="token1Num" 
                                @input="inputEvent($event , 'token1Num')">
                            <div class="kind">{{tokenInfo.name1}}</div>
                        </div>
                        <div class="btn-area">
                            <!-- <div class="btn active">25%</div>
                            <div class="btn">50%</div>
                            <div class="btn">75%</div>
                            <div class="btn">100%</div> -->
                            <div 
                                v-for="(item) in btnsList "
                                :key="item.val"
                                :class="['btn',{'active':token1ActivePer === item.val}]"
                                @click="perBalanceClick(1,item.val)">
                                {{item.label}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mutiSele">
                <div class="title"> Leverage </div>
                <div class="area">
                    <div class="seleBar">
                        <el-slider
                            v-model="multiple"
                            :show-tooltip="false"
                            :step="1"
                            :max="tokenInfo.max"
                            :min="1">
                        </el-slider>
                        <div class="barinfo">
                            <span>1x</span>
                            <span>{{tokenInfo.max}}x</span>
                        </div>
                    </div>
                    <div class="display">
                        <span class="num">{{multiple}}</span>
                        <span class="x">x</span>
                    </div>
                </div>
            </div>
            <div class="browposition">
                <div class="title">
                    <div class="info">
                        I'd like to borrow
                        <span>(min：{{toFixed(tokenInfo.MIN , 6) || '--'}}，max：{{toFixed(tokenInfo.MAX , 6) || '--'}})</span>
                    </div>
                    <div class="balance">
                        <span 
                            class="balaLack"
                            v-if="Number(showBorrowAmount) > Number(borrowBalance)">超过最大可借出余额</span>
                        <span>可用余额：</span>
                        {{toFixed(borrowBalance , 6) || '--'}}
                    </div>
                </div>
                <div class="btns">
                    <div 
                        v-if="tokenInfo.borrowList.token0"
                        :class="['item' , {'active':borrowActive === 0}]"
                        @click="borrowActive = 0">
                        {{tokenInfo.name0}}
                    </div>
                    <div 
                        v-if="tokenInfo.borrowList.token1"
                        :class="['item' , {'active':borrowActive === 1}]"
                        @click="borrowActive = 1">
                       {{tokenInfo.name1}}
                    </div>
                </div>
                <div class="warnTips">
                    <img src="@/assets/warntips.png" alt="">
                    <span>To supply 2 assets with equal value is suggested, in this way the trading fee and slippage is minimized.</span>
                </div>
            </div>
            <div class="handlingFee">
                <div class="title">
                    <div class="info">
                        Price Impact and Trading Fees
                    </div>
                    <!-- <div class="balance">
                        - 1.3%
                    </div> -->
                </div>
                <div class="content">
                    <div class="line">
                        <div class="tit">Assets Supplied</div>
                        <div class="cnt">{{toFixed(token0Num || 0 , 6)}} {{tokenInfo.name0}} + {{toFixed(token1Num || 0 , 6)}} {{tokenInfo.name1}}</div>
                    </div>
                    <div class="line">
                        <div class="tit">Assets Borrowed</div>
                        <div class="cnt">{{toFixed(showBorrowAmount || 0 , 6)}} {{borrowName}}</div>
                    </div>
                    <div class="line">
                        <div class="tit">Total Assets in Position Value</div>
                        <div class="cnt">{{totalToken0Amount+ ' ' + tokenInfo.name0}} +  {{totalToken1Amount+ ' '+tokenInfo.name1}}</div>
                    </div>
                    <div class="line">
                        <div class="tit">Debt Ratio</div>
                        <div class="cnt">{{toFixed(riskCoeff , 2)}}%</div>
                    </div>
                    <div class="line">
                        <div class="tit">Total APY</div>
                        <div class="cnt"><span class="green">{{tokenInfo.complexRate}}%</span><img src="@/assets/warngreen.png" alt=""></div>
                    </div>
                </div>
            </div>
            <div class="submitOrder">
                <button :class="['enter' , {'disabled' : btnDisabled} ]" 
                        :disabled="btnDisabled"
                        @click="confirmMint" 
                        v-loading='subBtnLoading'>
                    {{btnTextInfo}}
                </button>
                <div class="btn" @click="$router.go(-1)">
                    BACK
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { getBalance  , isApproved , getToken2TokenPrice} from '@/wallet/Inquire'
import { mintWork , approve} from '@/wallet/trade'
import Address from '@/wallet/address.json'
import { mapState } from 'vuex'
export default {
    name:'MintDetail',
    data(){
        return {
            // riskCoeff:'--',
            
            multiple:1,
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
            borrowActive:0,
            borrowList:[],
           
            
            tokenInfo:{
                token0:'',
                token1:'',
                name0:'--',
                name1:'--',
                balance0:0,
                balance1:0,
                decimals0:18,
                decimals1:18,
                borrowList:{
                    token0:true , 
                    token1:true
                },
                type:'',
                posId:'',
                strategyAdd:'',
                BankBalance0:'--',
                BankBalance1:'--',
                complexRate:'--',
                max:9,
                MAX:0,
                MIN:0
            },
            subBtnLoading:true,

            approve1:false,
            approve0:false,
            tokenToTokenPrice:1,


        }
    },
    computed:{
        borrowToken1(){
            return (Number(this.token0Num)*this.tokenToTokenPrice + Number(this.token1Num))*(this.multiple - 1)
        },
        borrowToken0(){
            return this.tokenToTokenPrice === '0' ? Number(this.token0Num)*(this.multiple - 1) : (Number(this.token0Num) + Number(this.token1Num)/this.tokenToTokenPrice)*(this.multiple - 1)
        }, 
        showBorrowAmount(){
            return this.borrowActive === 0 ? this.borrowToken0 : this.borrowToken1
        },
        borrowBalance(){
            return this.borrowActive === 0 ? this.tokenInfo.BankBalance0 : this.tokenInfo.BankBalance1
        },
        borrowName(){
            return this.borrowActive === 0 ? this.tokenInfo.name0 : this.tokenInfo.name1
        },
        btnDisabled(){
            return this.approve1 && this.approve0 && ((!Number(this.token0Num)&&!Number(this.token1Num)) || Number(this.token0Num) > this.tokenInfo.balance0 || Number(this.token1Num)>this.tokenInfo.balance1 || Number(this.showBorrowAmount) > Number(this.borrowBalance))
        },
        btnTextInfo(){
            if(!this.approve0){
                return 'Approve ' + this.tokenInfo.name0
            }
            if(!this.approve1){
                return 'Approve ' + this.tokenInfo.name1
            }

            return 'Farm ' + this.multiple + 'x' 
        },
        totalTokenASToken1(){
            return this.borrowActive === 0 ? ((Number(this.token0Num) + this.showBorrowAmount)*this.tokenToTokenPrice + Number(this.token1Num)) : (Number(this.token0Num)*this.tokenToTokenPrice + Number(this.token1Num) + this.showBorrowAmount)
        },
        totalToken0Amount(){
            return this.toFixed(this.totalTokenASToken1*0.5*this.tokenToTokenPrice , 6)
        },
        totalToken1Amount(){
            return this.toFixed(this.totalTokenASToken1*0.5 , 6)
        },
        riskCoeff(){
            if(!this.totalTokenASToken1){
                return 0
            }
            return this.showBorrowAmount / this.totalTokenASToken1 * 100
        },
        ...mapState({
            mainTheme:state=>state.comps.mainTheme,
        })
    },
    created(){
        try{
            let JsonInfo = sessionStorage.getItem('mintInfo') 
            let info = JSON.parse(JsonInfo)
            for(let key in info){
                    this.tokenInfo[key] = info[key]
            }
            this.tokenInfo.max = Number(info.max)
            if(info.multiple && !isNaN(info.multiple)) {
                this.multiple = Number(info.multiple)
            }
            if(info.borrowList && !info.borrowList.token0){
                this.borrowActive = 1
            }
        }catch(err){
        }
        setTimeout(()=>{
            this.getAllBalancesApprove() // 获取余额
        } , 300)
        console.log('type' , this.tokenInfo);
    },
    methods:{
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        perBalanceClick(type , val){
            if(type === 0){
                this.token0Num = this.toFixed(this.tokenInfo.balance0*val/100 , 6)
                this.token0ActivePer = val
            }else if(type === 1){
                this.token1Num = this.toFixed(this.tokenInfo.balance1*val/100 , 6)
                this.token1ActivePer = val
            }
        },
        inputEvent(e , pointer){
            this[pointer] = this.$inputLimit(e , 6 , true)
            let balance = 0
            switch (pointer){
                case 'token0Num' :
                    balance = this.tokenInfo.balance0
                    this.token0ActivePer = Number(this[pointer]) / balance * 100
                    break;
                case 'token1Num':
                    balance = this.tokenInfo.balance1
                    this.token1ActivePer = Number(this[pointer]) / balance * 100
                    break;
            }

            // console.log('totalTokenASToken1',this.totalTokenASToken1);
            // console.log('RISKCOEFF',this.riskCoeff);

        },
        confirmMint(){
            const {token0 , token1 , decimals0 , decimals1 , strategyAdd}  = this.tokenInfo
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

            // let type = this.tokenInfo.type
            // type === ""
            mintWork(token1,token0 , this.token1Num||0 ,   this.token0Num||0  , decimals1 ,decimals0   , this.toFixed(this.borrowToken1 , 6) , 0 , this.tokenInfo.posId, strategyAdd)
            .then(()=>{
                this.$store.dispatch('getUserPosition')
            })
        },
        async getAllBalancesApprove(){
            const { token0 , token1 , decimals0 , decimals1 , strategyAdd} = this.tokenInfo
            if(token0) {
                let balance0 = await getBalance(token0 ,decimals0)
                this.tokenInfo.balance0 = balance0
                this.approve0 = await isApproved( token0,decimals0 ,balance0 ,strategyAdd )
            }
            if(token1){
                let balance1 = await getBalance(token1 ,decimals1)
                this.tokenInfo.balance1 = balance1
                this.approve1 = await isApproved( token1,decimals1 ,balance1 ,strategyAdd )
            }
            this.tokenToTokenPrice = await getToken2TokenPrice(token1,token0 , this.tokenInfo.type)
            this.subBtnLoading = false
            console.log('tokenToTokenPrice' , this.tokenToTokenPrice , this.tokenInfo.type);
            

        }
    }
}
</script>
<style lang="scss" scoped>
.app-container{
    padding: 27px 75px 45px 75px;
    
    .title {
        font-size: 0;
        img{
            height: 24px;
            position: relative;
            z-index: 2;
            margin-right: 13px;
            vertical-align: middle;
        }
        .img2{
            z-index: 1;
            margin-left: -22px;
        }
        >span {
            font-size: 18px;
            font-weight: bold;
            vertical-align: middle;
            @include balanceFont($balanceFont-light)
        }
    }
    .infoBar{
        // padding-top: 35px;
        padding: 35px 100px 0 100px;
        position: relative;
        .content{
            display: flex;
            justify-content: space-between;
            .item {
                position: relative;
                z-index: 2;
                .num {
                    height: 24px;
                    width: 24px;
                    line-height: 24px;
                    border-radius: 14px;
                    border: 2px solid #002EFF;
                    text-align: center;
                    color: #002EFF;
                    margin: 0 auto;
                    background-color: #fff;
                }
                >p{
                    font-size: 15px;
                    color:#002EFF ;
                    margin:0;
                    margin-top: 10px;

                }
            }
        }
        .progressbar{
            position: absolute;
            height: 8px;
            width: calc(100% - 290px);
            border-radius: 4px;
            background: linear-gradient(90deg, #0096FF, #0024FF);
            top: 44px;
            left: 142px;
        }
    }
    .seleArea{
        .title{
            font-size: 18px;
            font-weight: bold;
            padding-top: 44px;
        }
        .coinList{
            .item {
                padding-top: 24px;
                .balance {
                    margin: 0;
                    text-align: right;
                    font-size: 12px;
                    height: 16px;
                    .tit {
                        color: #999999;
                    }
                    .num {
                        // color: #1C1C1B;
                        @include mainFont($color-mainFont-light)

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
                        // padding: 0 120px 0 62px;
                        box-sizing: border-box;
                        vertical-align: middle;
                        @include balanceFont($balanceFont-light);
                    }
                }
                .btn-area {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 12px;
                    .btn {
                        width: 150px;
                        height: 36px;
                        border-style: solid;
                        border-width: 1px;
                        // border: 1px solid #333333;
                        // color: #333333;
                        text-align: center;
                        line-height: 36px;
                        border-radius: 19px;
                        cursor: pointer;
                        @include commonbtn($commonbtn-light);
                    }
                    .btn.active {
                        // border: 1px solid #0031FF;
                        // color: #0031FF;
                        @include btnBorderColor($color-btnBorderColor-light)
                    }
                }
            }
        }
    }
    .mutiSele{
        .area{
            display: flex;
            justify-content: space-between;
            .seleBar{
                width: 727px;
                padding-left: 10px;
                box-sizing: border-box;
                ::v-deep{
                    .el-slider__runway{
                        @include sliderBarBg($sliderBarBg-light);
                    }
                }
            }
            .barinfo{
                display: flex;
                justify-content: space-between;
                width: calc(100% + 10px);
                margin-left: -10px;
                font-size: 14px;
                margin-top: -6px;
                // color: #333333;
                @include balanceFont($balanceFont-light)
            }
            .display{
                height: 38px;
                width: 98px;
                // background-color: rgba(0, 49, 255,.06);
                @include mutiSeleDisplayBg($mutiSeleDisplayBg-light , $mutiSeleDisplayfont-light);
                border-radius: 8px;
                span{
                    display: inline-block;
                    height: 100%;
                    line-height: 38px;
                    text-align: center;
                    // color: #002AFF;
                }
                .num {
                    width: 59px;
                    border-right: 1px dashed #C0CBFF;
                    font-size: 16px;
                    font-weight: bold;
                }
                .x {
                    width: 38px;
                    font-size: 14px;
                }
            }
        }
        .title{
            font-size: 18px;
            font-weight: bold;
            padding-top: 45px;
            padding-bottom: 24px;
        }
    }
    .browposition{
        .title {
            display: flex;
            justify-content: space-between;
            padding-top: 44px;
            .info {
                font-size: 18px;
                font-weight: bold;
                span {
                    font-weight: normal;
                    font-size: 16px;
                }
            }
            .balance{
                font-size: 14px;
                span {
                    color: #999999;
                }
                .balaLack{
                    display: inline-block;
                    color: #f00;
                    font-size: 16px;
                    margin-right: 20px;
                    font-weight: 600;
                }
            }
        }
        .btns{
            display: flex;
            padding-top: 22px;
            .item {
                height: 38px;
                width: 90px;
                text-align: center;
                line-height: 38px;
                border: 1px solid #333333;
                color: #333333;
                border-radius: 20px;
                margin-right: 15px;
                cursor: pointer;
            }
            .item.active {
                color: #002EFF;
                border-color: #0031FF;
            }
        }
        .warnTips{
            padding: 15px;
            font-size: 14px;
            // background-color: rgba(255, 0, 0 , .2);
            @include warnTipsBg($warnTipsBg-light);
            border-radius: 8px;
            margin-top: 23px;
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
    }
    .handlingFee {
        padding-top: 45px;
        .title  {
            display: flex;
            justify-content: space-between;
            .info {
                font-size: 18px;
                font-weight: bold;
                
            }
            .balance{
                font-size: 18px;
                font-weight: bold;
                color: #EE1E1E;
            }
        }
        .content {
            padding: 23px;
            background-color: rgba(0, 0, 0 , .06);
            border-radius: 8px;
            margin-top: 23px;
            .line {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                margin-bottom: 12px;
                @include mainFontSubNav($color-mainFontSubNav-light);
                .tit {
                    // color: #666666;
                }
                img {
                    vertical-align: middle;
                    height: 14px;
                    margin-left: 8px;
                }
                span {
                    vertical-align: middle;
                }
                .green {
                    font-weight: 600;
                    color: #00B23B;
                }
            }
            .line:nth-last-of-type(1) {
                margin-bottom: 0;
            }
        }
    }
    .submitOrder {
        padding-top: 45px;
        display: flex;
        justify-content: center;
        >div{
            width: 180px;
            height: 38px;
            line-height: 34px;
            text-align: center;
            font-size: 17px;
            box-sizing: border-box;
            border-radius: 19px;
            cursor: pointer;
        }
        .btn {
            border: 1px solid #0031FF;
            color: #002EFF;
        }
        .enter {
            background: linear-gradient(90deg, #0096FF, #0024FF);
            color: #fff;
            line-height: 36px;
            margin-right: 23px;
            position: relative;
            overflow: hidden;
            width: 180px;
            height: 38px;
            border: none;
            border-radius: 19px;
            outline: none;
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
</style>
