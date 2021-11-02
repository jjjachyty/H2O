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
                    <span class="name">{{type==='un' ? 'Unstake Tokens' : 'Stake Tokens'}}</span>
                </div>
                
            </div>
            <p class="title"  v-if="kind || isDemand">
                <span>I’d like to {{this.type === 'un' ? 'unstake' : 'stake'}}</span>
                
            </p>
            <p class="title" v-else>
            <!-- <p class="title"> -->
                <span>I’d like to {{this.type === 'un' ? 'unstake' : 'stake'}}</span>
                <button
                    v-for="(item) in days"
                    :key="item.id"
                    :class="['btn' , {'active': activeDayIndex === item.id}]"
                    @click="toggleDays(item)">
                    {{item.name}}
                </button>
            </p>

            <div class="input-area">
                <div class="receInfo" v-if="type === 'pl'">
                    <div v-if="isDemand">
                        APY：<span>{{toFixed(fixedAPY||0 , 2)||'--'}}%</span>
                    </div>
                    <div v-else-if="activeDayIndex === demandpId.D90">
                        APY：<span>{{toFixed(demandAPY.APY90||0 , 2)||'--'}}%</span>
                    </div>
                    <div v-else-if="activeDayIndex === demandpId.D180">
                        APY：<span>{{toFixed(demandAPY.APY180||0 , 2)||'--'}}%</span>
                    </div>
                    <div v-else>
                        APY：<span>{{toFixed(demandAPY.APY365||0 , 2)||'--'}}%</span>
                    </div>
                </div>
                <div class="balance" v-if="!isDemand&&type==='un'">
                    <span class="info">Claimable now：</span>
                    <span class="num">{{toFixed(ableReceive , 6) || '--'}} {{name}}</span>
                </div>
                <div class="balance">
                    <span class="info">Balance：</span>
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
            <div class="receive" v-if="type === 'un'">
                <p class="tit">You will receive：</p>
                <p class="num">
                    {{depositNum || '--'}} {{name}}
                    <template v-if="!GettingApprove&&(tokenBalance!=='--')">
                    <!-- <template > -->
                        <span class="plus"> + </span>
                        <span>{{toFixed(rewardAmount , 6) || '--'}} H2O</span>
                        <el-tooltip class="item" effect="dark"  placement="right">
                            <div slot="content">
                                <div v-loading="toolTipsLoading" >
                                    <div class="tooltipsItem">
                                        <div class="left">
                                            <img :src="currentTokenImage('H2O')" alt="">
                                            <span>H2O Vesting</span>
                                        </div>
                                        <div class="right">
                                            <span class="amount">{{toFixed(toolTips0 ,6) || '--'}}</span>
                                            <span>H2O</span>
                                        </div>
                                    </div>
                                    <div class="tooltipsItem">
                                        <div class="left">
                                            <img :src="currentTokenImage('H2O')" alt="">
                                            <span>H2O Claimable</span>
                                        </div>
                                        <div class="right">
                                            <span class="amount">{{toFixed(toolTips1,6) || '--'}}</span>
                                            <span>H2O</span>
                                        </div>
                                    </div>
                                </div>
                                Vesting Schedule: 210 days linear vesting.<br/>
                                Vesting once every  days.<br/>
                                Vesting starts once you harvest.<br/>
                                Check and claim your vesting rewards at Claim page after you harvest.
                            </div>
                        <i class="el-icon-question"></i>
                        
                        </el-tooltip>
                    </template>
                </p>

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
import { approve , pledgePutIn , pledgePutOut } from '@/wallet/trade'
import { getBalance , isApproved , getPledgeBalance , getPledgeReceiveable , getPledgeRewardInfo , getPledgeRewardInfo1} from '@/wallet/Inquire'
import { fromWei } from '@/utils/tools'
export default {
    name:'PledegDetail',
    data(){
        return {
            propertyList:[
                {id:1 , name:'币种'},
            ],
            days:[
                {id:2 , name:'90Days' , key:'D90'},
                {id:3 , name:'180Days' , key:'D180'},
                {id:4 , name:'365Days' , key:'D365'},
            ],
            activeDayIndex:4,
            depositNum:'',
            // toolTips0:'--',
            // toolTips1:'--',
            toolTipsLoading:false,



            tokenBalance:'--',
            ableReceive:'--',
            rewardAmount:'',
            tokenAddress:'',
            originName:'',
            name:'',
            approved:0,
            decimals:18,
            isDemand:false,
            fixedpId:'',
            demandpId:{
                D90:'',
                D180 :'',
                D365 :'',
            },
            fixedAPY:'',
            demandAPY:{
                APY90:'',
                APY180:'',
                APY365:'',
            },
            unfoldTypeBalance:{
                day90: { balance:'--' ,already:false , ableReceive:''},
                day180: { balance:'--' ,already:false , ableReceive:''},
                day365: { balance:'--' ,already:false , ableReceive:''},
            }

        }
    },
    created(){
        try{
            let JsonInfo = sessionStorage.getItem('plInfo') 
            let info = JSON.parse(JsonInfo)
            this.tokenAddress = info.token
            this.isDemand = info.demand
            this.decimals = info.decimals
            this.name = info.name
            this.originName = info.originName
            if(info.demand){
                this.fixedpId = info.pId
                this.fixedAPY = info.YearPer
            }else {
                this.days.forEach(item=>{
                    item.id = info[item.key]
                })
                this.activeDayIndex = info.D365
                this.demandpId.D90 = info.D90
                this.demandpId.D180 = info.D180
                this.demandpId.D365 = info.D365
                this.demandAPY.APY90 = info.YearPer90
                this.demandAPY.APY180 = info.YearPer180
                this.demandAPY.APY365 = info.YearPer365
            }
            if(this.type ==='un'){
                this.rewardAmount = info.reward
            }
            // if(this.type === 'un'){
                
            // }else {
            // }
            
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
                    this.type !=='un' ? this.getTokenBalanceApprove() : this.getTokenBalance(this.pid)
                    // this.getRewardInfo()
                }
            }
        },
        tokenAddress:{
            handler(val){
                if(this.isConnected && val){
                    this.type !=='un' ? this.getTokenBalanceApprove() : this.getTokenBalance(this.pid)
                    // this.getRewardInfo()
                }
            }
        }
    },
    computed:{
        toolTips0(){
            let reward = Number(this.rewardAmount)
            return isNaN(reward) ? 0 : reward - (reward / 210)
        },
        toolTips1(){
            let reward = Number(this.rewardAmount)
            return isNaN(reward) ? 0 : reward / 210
        },
        btnDisabled(){
            return this.isConnected && !(this.approved === 2 && this.type!=='un')  && !Boolean(Number(this.depositNum)) || this.isOverMax 
        },
        themeText(){
            return this.type === 'un' ? 'Unstake' : 'Stake'
        },
        type(){
            return this.$route.query.type
        },
        kind(){
            return this.$route.query.kind
        },
       
        GettingApprove(){
            return this.isConnected && this.approved === 0 
        },
        submitBtnText(){
            return this.isConnected ? ( this.approved === 2 && this.type!=='un' ? 'Approve' : this.themeText) :'Connect Wallet'
        },
        isOverMax(){
            let bool = false
            if(this.isDemand){
                bool =  (this.tokenBalance === '--' && Number(this.depositNum)) || (this.tokenBalance !== '--' && Number(this.depositNum) > Number(this.tokenBalance) ) 
            }else {
                bool = (this.tokenBalance === '--' && Number(this.depositNum)) || (this.tokenBalance !== '--' && Number(this.depositNum) > Number(this.tokenBalance) ) || (Number(this.depositNum)>Number(this.ableReceive))
            }
            return   bool
        },
        unfoldActiveString(){
            let kind = 'day365'
            switch (this.activeDayIndex){
                case this.demandpId.D90 :
                    kind = 'day90'
                    break;
                case this.demandpId.D180 :
                    kind = 'day180'
                    break;
            }
            return kind
        },
        pid(){
            if(!this.isDemand){
                return this.activeDayIndex
            }

            // let index = 6
            // switch(this.isDemand){
            //     case 'hH2O':
            //         index = 7;
            //         break;
            //     case 'rH2O':
            //         index = 7
            //         break;
            //     case 'wBNB':
            //         index = 6
            // }
            // return index
            return this.fixedpId
        },
        ...mapState({
            isConnected:state=>state.base.isConnected,
            fairLaunchAddress:state=>state.base.fairLaunchAddress,
            mainTheme:state=>state.comps.mainTheme,
        }),
    },
    methods:{
        async getRewardInfo(){
            this.toolTips0 = await getPledgeRewardInfo()
            this.toolTips1 = await getPledgeRewardInfo1()
            this.toolTipsLoading = false
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        inputEvent(e){
            this.depositNum = this.$inputLimit(e , 6 , true)
        },
        toggleDays(item) {
            this.activeDayIndex = item.id
            if(this.type!=='un') return 
            const { already , balance } = this.unfoldTypeBalance[this.unfoldActiveString]
            // if(already){
            //     this.tokenBalance = balance
            // }else {
                this.approve = 0
                this.getTokenBalance(this.activeDayIndex)
            // }
        },
        returnPage(){
            this.depositNum = ''
            this.$router.go(-1)
        },
        submitOrder(){
            if(!this.isConnected) return this.$connect()

            if(this.approved === 2 && this.type  !== 'un'){
                console.log('tokenAddress',this.tokenAddress);
                console.log('fairLaunchAddress',this.fairLaunchAddress);
                approve(this.tokenAddress , this.fairLaunchAddress)
                .then(()=>{
                    this.approved = 1
                })
                return
            }
            // let index = this.isDemand === 'hBNB' ? 6 : ( (this.kind || this.isDemand )? 5 : this.activeDayIndex  )
            let tradeFunc = this.type === 'un' ? pledgePutOut : pledgePutIn
            let index = this.activeDayIndex
            tradeFunc(this.tokenAddress , this.decimals , this.depositNum , this.pid)
            .finally(()=>{
                this.depositNum = ''
                this.approve = 0
                this.getTokenBalance(this.pid , index)
                this.$store.dispatch('judgeDepositCurrentIsIRO' , this.tokenAddress)
            })
        },
        clickAllBtn(){
            if(!this.isConnected || !this.tokenBalance) return 
            this.depositNum = this.tokenBalance
        },
        async getTokenBalanceApprove(){
            let balance = await getBalance(this.tokenAddress,this.decimals )
            console.log('balance',balance);
            this.tokenBalance = balance 

            isApproved(this.tokenAddress , this.decimals , balance , this.fairLaunchAddress).then(bool=>{
                this.approved = bool ? 1 : 2
                // this.approved = 2
            })
        },
        // unfoldString(index){
        //     let kind = 'day365'
        //     switch (index){
        //         case 0 :
        //             kind = 'day90'
        //             break;
        //         case 1 :
        //             kind = 'day180'
        //             break;
        //     }
        //     return kind
        // },
        async getTokenBalance(type = 2 ){
            if( this.type === 'un') {
                let balance = await getPledgeBalance(type , this.decimals)
                balance = fromWei(balance['0'] || 0 , this.decimals)
                if(balance === '0'){
                    this.rewardAmount = 0
                }
                console.log('balance',balance);
                let ableReceive = 0
                try {
                    ableReceive = await getPledgeReceiveable(type , this.decimals)
                }catch(err){
                    console.log('无可领取');
                }
                // let ableReceive = balance
                console.log('ableReceive' , ableReceive)
                this.tokenBalance = balance
                this.ableReceive = ableReceive
                this.approved = 1
                // let activeIndex = isNaN(index) ? this.activeDayIndex : index
                // console.log('更新余额type' , type);
                // console.log('更新余额index' , activeIndex);
                this.unfoldTypeBalance[this.unfoldActiveString].already = true
                this.unfoldTypeBalance[this.unfoldActiveString].balance = balance
                this.unfoldTypeBalance[this.unfoldActiveString].ableReceive = ableReceive
                
            }else {
                let balance = await getBalance(this.tokenAddress,this.decimals )
                console.log('balance',balance);
                this.tokenBalance = balance 
                this.approved = 1
            }
            
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
            // color: #1C1C1B;
            @include mainFont($color-mainFont-light);
        }
    }
    .property {
        padding-bottom: 45px;
        display: flex;
        align-items: center;
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
                margin-right: 17px;
                @include btnBorderColor($color-btnBorderColor-light);
            }
            .name {
                font-size: 15px;
                // color: #002DFF;
                @include blueFont($blueFont-light);
            }
        }
        .info {
            font-size: 14px;
            margin-left: 20px;
            font-weight: 600;
        }
    }
    .title {
        // color: #1C1C1B;
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 22px;
        @include mainFont($color-mainFont-light);
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
        .receInfo {
            text-align: right;
            font-size: 12px;
            margin-bottom: 8px;
            span {
                font-weight: 600;
                font-size: 14px;
            }
        }
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
                // color: #333333;
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
            font-size: 26px;
            @include blueFont($blueFont-light);
        }
        .plus {
            font-size: 30px;
            font-weight: 600;
            color: #999;
        }
        .el-icon-question {
            font-size: 14px;
            color: rgba(0, 49, 255, 0.6);
            display: inline-block;
            vertical-align: text-top;
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