<template>
    <div class="app-container">
        <div class="commin-title">
            <div class="title-inner">
                <img src="@/assets/airdrop_menu.png" alt="">
                <span class="tit">Invite new users to participate</span>
            </div>
            
        </div>
        <div class="app-inner">
            <div class="link-address" v-if="address">
                <div class="link">
                    {{reAddress}}
                </div>
                <div class="copy" v-clipboard:copy="reAddress" v-clipboard:success="copySuccess">
                    Copy
                </div>
            </div>
            <div class="rules">
                <p class="tit">Invitation reward rules:</p>
                <p>1. New users must use the invitation link of the invitee to enter the website and receive the airdrop before the invitation is considered successful,</p>
                <p>2. After the new user is invited, the invitee and the invitee will receive an airdrop reward at the same time,</p>
                <p>3. As a new invitee, the invitee will also get an airdrop after re inviting new users, and so on. The maximum invitation level is level 4,</p>
                <p>4. After the relationship between the invitees is established, the invitees will not only receive the air drop reward, but also receive a certain proportion of the lower level mining income. For detailed rewards, please refer to the official reward announcement,</p>
                <p>5. A certain proportion of the owner's mining revenue will be equally distributed to the superior, and the undistributed part without the superior will be destroyed,</p>
                <p>6. For the payment of mining recommendation reward, the amount of warehouse lock of the rewarded account shall reach 10% of the recommended person's warehouse lock amount. If not, it shall also be destroyed directly.</p>
            </div>
            <div class="recommand">
                <p class="com-title">
                    My airdrop reward
                    <span>（You can only invite success if your friend accepts the prize）</span>
                </p>
                <div class="list-outer">
                    <div class="head">
                        <div class="item">Coin</div>
                        <div class="item">Claimable</div>
                        <div class="item">Claimed</div>
                        <div class="item opera">Action</div>
                    </div>
                    <div class="body">
                        <div class="item">
                            <div class="kind">
                                <img :src="currentTokenImage('H2O')" alt="">
                                H2O
                            </div>
                            <div class="amount">
                                $ {{isTokenBtnDisbaled ? '1' :  airdropBalance }}
                            </div>
                            <div class="receive">
                                $ {{airDropDrawed}}
                            </div>
                            <div class="operation">
                                <div 
                                    @click="receiveDrop"
                                    :class="{'disabled':(!isTokenBtnDisbaled && airdropBalance === '0') || !isConnected}">Claim</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="reward">
                <p class="com-title">
                    The invitation details
                    <span>（Underling）</span>
                </p>
                <div class="list-outer" v-if="!inviteListState">
                    <div
                        v-for="(item,index) in inviteList" 
                        :key="index"
                        class="item">
                        {{item}}
                    </div>
                    
                </div>
                <div :class="['loading' , {'isLoading':listLoading}]" v-else v-loading="listLoading">
                    {{inviteListText}}
                </div>
            </div>
            <div class="recommand rewardrecommand">
                <p class="com-title">Mining rewards for referrals</p>
                <div class="list-outer" v-loading='rewardLoading'>
                    <div class="head">
                        <div class="item">Coin</div>
                        <div class="item">Claimable</div>
                        <!-- <div class="item">已领取奖励</div> -->
                        <div class="item opera">Action</div>
                    </div>
                    <div class="body">
                        <div class="item" >
                            <div class="kind">
                                <img :src="currentTokenImage('H2O')" alt="">
                                H2O
                            </div>
                            <div class="amount">
                                {{reward}} H2O
                                <el-tooltip effect="dark"  placement="right">
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
                            </div>
                            <!-- <div class="receive">
                                10.00 H2O
                            </div> -->
                            <div class="operation">
                                <div 
                                    @click="receiveMint" 
                                    :class="{ 'disabled' : reward==='--'||reward === '0' }"
                                    v-loading="gettingReward">Claim</div>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <div class="kind">
                                <img :src="currentTokenImage('H2O')" alt="">
                                H2O
                            </div>
                            <div class="amount">
                                $ 100.00
                            </div>
                            <div class="receive">
                                $ 10.00
                            </div>
                            <div class="operation">
                                <div>领取</div>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { receiveAirdrop , receiveMintReward} from '@/wallet/trade'
import { getAirdropMintReward ,getPledgeRewardInfo , getPledgeRewardInfo1 } from '@/wallet/Inquire'
import { mapState } from 'vuex'
export default {
    name:'Index',
    data(){
        return  {
            rewardLoading:false,
            reward:'--',
            gettingReward:false,
            // toolTips0:'',
            // toolTips1:'',
            toolTipsLoading:false,
        }
    },
    async mounted(){
        // console.log('this.$route.query',this.$route.query);
        // console.log('airdropBalance',this.airdropBalance);
        // console.log('airDropDrawed',this.airDropDrawed);
    },
    computed:{
        ...mapState({
            address:state=>state.base.address,
            isConnected:state=>state.base.isConnected,
            listLoading:state=>state.base.inviteList.loading, 
            inviteList:state=>state.base.inviteList.list,
            airdropBalance:state=>state.base.airdropBalance,
            airDropDrawed:state=>state.base.airDropDrawed,
            mainTheme:state=>state.comps.mainTheme
        }),
        toolTips0(){
            let reward = Number(this.reward)
            return isNaN(reward) ? 0 : reward - (reward / 210)
        },
        toolTips1(){
            let reward = Number(this.reward)
            return isNaN(reward) ? 0 : reward / 210
        },
        recommandAddress(){
            const { query } = this.$route
            return query.re
        },
        inviteListText(){
            let text = ''
            if(this.isConnected){
                if(this.listLoading ){
                    text = ''
                }else {
                    if(!this.inviteList.length){
                        text = "There's nothing here"
                    }
                }
            }else {
                text = 'Connect Wallet'
            }
            return text
        },
        inviteListState(){
            return !this.isConnected || this.listLoading || !this.inviteList.length
        },
        isTokenBtnDisbaled(){
            return this.airDropDrawed === '0' && this.airdropBalance === '0'
        },
        reAddress(){
            return `http://47.241.171.176/index.html#/airdrop?re=${this.address}`
        }
    },
    watch:{
        isConnected:{
            immediate:true,
            async handler(val){
                if(val){
                    this.rewardLoading = true
                    this.reward = await getAirdropMintReward()
                    this.rewardLoading = false
                    // this.getRewardInfo()
                }
            }
        }
    },
    methods:{
        // async getRewardInfo(){
        //     this.toolTips0 = await getPledgeRewardInfo()
        //     this.toolTips1 = await getPledgeRewardInfo1()
        //     this.toolTipsLoading = false
        // },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        async receiveDrop(){
            if(!this.isTokenBtnDisbaled && this.airdropBalance === '0') return 
            let address = this.recommandAddress
            if(!address ){
                address = this.address
            }
            receiveAirdrop(address)
        },
        async receiveMint(){
            if(!Number(this.reward)) return 
            this.gettingReward = true
            receiveMintReward()
            .then(async ()=>{
                this.rewardLoading = true
                this.reward = await getAirdropMintReward()
                this.rewardLoading = false
            })
            .finally(()=>{
                this.gettingReward = false
            })
        },
        copySuccess(){
            this.$notify({
                title: 'Copy successfully!',
                type: 'success',
                duration: 3000

            })
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        }
    }
}
</script>
<style lang="scss" scoped>
.com-title {
    font-size: 18px;
    font-weight: 600;
    margin: 45px 0 22px 0;
    width: 100%;
    @include mainFont($color-mainFont-light);

    span {
        font-size: 14px;
        font-weight: normal;
    }
}
.link-address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0 23px 0;
    .link {
        height: 44px;
        border-radius: 8px;
        font-size: 14px;
        padding-left: 16px;
        background-color: rgba(0, 48, 255 , 0.06);
        flex-grow: 1;
        line-height: 44px;
    }
    .copy {
        margin-left: 60px;
        height: 30px;
        line-height: 30px;
        padding: 0 16px;
        font-size: 14px;
        @include btnBorderColor($color-btnBorderColor-light);
        // color: #0024FF;
        border-radius: 15px;
        // border: 1px solid #0024FF;
        cursor: pointer;
        font-weight: 600;
        user-select: none;
    }
}
.rules {
    padding: 23px;
    background-color: rgb(0, 0, 0 , 0.06);
    border-radius: 8px;
    p {
        margin: 9px 0;
        font-size: 14px;
    }
    p:nth-last-of-type(1){
        margin-bottom: 0;
    }
    .tit {
        margin-top: 0;
        @include mainFont($color-mainFont-light);
        font-size: 18px;
        font-weight: 600;
    }
}
.reward {
    .loading {
        height: 40px;
        text-align: center;
        letter-spacing: 1px;
        font-size: 20px;
        font-weight: 600;

    }
    .isLoading {
        min-height: 200px;
    }
    .list-outer{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

    }
    .item {
        line-height: 44px;
        height: 44px;
        width: calc(50% - 12px);
        margin-bottom: 24px;
        padding-left: 16px;
        box-sizing: border-box;
        background-color: rgb(0, 48, 255 , 0.06);
        border-radius: 8px;
        font-size: 14px;
    }
}
.recommand {
    .list-outer {
        background-color: rgb(0, 0, 0 , 0.06);
        border-radius: 8px;
        padding: 15px 22px 0 22px;
        padding-bottom: 1px;
        .head {
            display: flex;
            margin-bottom: 26px;
            .item {
                width: 30%;
                font-size: 14px;
                color: #666666;
                font-weight: 600;
            }
            .opera {
                width: 10%;
            }
        }
        .body {
            .item {
                display: flex;
                margin-bottom: 26px;
                >div{
                    width: 30%;
                    font-size: 12px;
                    @include mainFont($color-mainFont-light);
                    line-height: 30px;
                }
                .operation {
                    width: 10%;
                    
                }
                .kind {
                    img {
                        height: 23px;
                        vertical-align: middle;
                    }
                }
                .amount {
                    font-weight: 600;
                }
                .receive {
                    font-weight: 600;
                }
                .operation {
                    >div{
                        cursor: pointer;
                        height: 30px;
                        line-height: 30px;
                        padding: 0 30px;
                        font-size: 14px;
                        @include btnBorderColor($color-btnBorderColor-light);
                        // color: #0024FF;
                        // border: 1px solid #0024FF;
                        border-radius: 15px;
                        width: 95px;
                        box-sizing: border-box;
                        user-select: none;
                        font-weight: 600;
                    }
                    .disabled {
                        color: #666666;
                        border-color: #666666;
                        cursor: not-allowed;
                    }
                }
            }
        }
    }

}
.recommand.rewardrecommand {
    .list-outer {
        .head {
            .item {
                width: 45%;
            }
            .opera {
                width: 10%;
            }
        }
        .body {
            .item {
                >div {
                    width: 45%;
                }
                .operation {
                    width: 10%;
                    >div {
                        ::v-deep{
                            .el-loading-mask{
                                border-radius: 15px;
                            }
                            .el-loading-spinner .circular{
                                height: 22px;
                                width: 22px;
                            }
                            .el-loading-spinner{
                                margin-top: -11px;
                            }
                        }
                    }
                }

            }
        }
    }
}
</style>