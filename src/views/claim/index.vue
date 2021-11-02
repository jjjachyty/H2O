<template>
    <div class="Claim-page">
        <!-- <div class="item"
            v-for="item in 5"
            :key="item"> -->
        <div class="item">
            
            <el-card shadow="hover" v-loading="receiveLoading">
                <div slot="header" class="clearfix">
                    <span>Claim Invita、Stake & Farms Rewards</span>
                </div>
                <div class="info">
                    <span class="tit">H2O to be unlock：</span>
                    <span class="cnt">{{toFixed(WaitingAmount , 6) || '--'}} H2O</span>
                </div>
                <div class="info">
                    <span class="tit">Claimable：</span>
                    <span class="cnt">{{toFixed(receiveNum , 6) || '--'}} H2O</span>
                </div>
                <p class="tips">
                    Vesting Schedule: 210 days linear vesting. Vesting once every days.
                </p>
                <p class="tips">
                    Please don’t claim too frequently as you have to pay gas fee every time you claim.
                </p>
                <div class="btn">
                    <button @click="receiveReward" 
                        :disabled="!Number(receiveNum)" 
                        :class="{'disabled':!Number(receiveNum)}">Claim</button>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { getPledgeRewardInfo1 , getPledgeRewardUnlock} from '@/wallet/Inquire'
import TOKENS from '@/wallet/tokens'
import { receiveAllTokenRewards } from '@/wallet/trade'
export default {
    name:"Claim",
    data(){
        return {
            receiveNum:'--',
            WaitingAmount:'--',
            receiveLoading:false,
            btnLoading:false
        }
    },
    computed:{
        ...mapState({
            isConnected:state=>state.base.isConnected,
        })
    },
    watch:{
        isConnected:{
            immediate:true,
            handler(val){
                if(val){
                    this.getReceiveAbled()
                }
            }
        }
    },
    methods:{
        async getReceiveAbled(){
            this.receiveLoading = true
            this.receiveNum = await getPledgeRewardInfo1()
            this.WaitingAmount = await getPledgeRewardUnlock()
            this.receiveLoading = false
        },
        receiveReward(){
            this.btnLoading = true
            receiveAllTokenRewards(TOKENS.H2O)
            .then(()=>{
                this.getReceiveAbled()
            })
            .finally(()=>{
                this.btnLoading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.Claim-page{
    width: 1050px;
    display: flex;
    flex-wrap: wrap;
    .item {
        margin-right: 20px;
        width: 330px;
        margin-bottom: 30px;
        cursor: default;
        ::v-deep{
            .el-card{
                border-radius: 8px;
                @include sideBarBgc($color-bgc-sideBar-light);
                @include claimCardBorder($claimCardBorder-light);
            }
            .el-card__header{
                text-align: center;
                @include claimCardBorder($claimCardBorder-light);
                @include mainFont($color-mainFont-light)
            }
        }
        .info{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 14px;
            .tit {
                color: #999999;
            }
            .cnt {
                font-weight: 600;
                @include mainFont($color-mainFont-light)
            }
        }
        .tips{
            margin: 0;
            margin-bottom: 10px;
            font-size: 12px;
            @include otherFont($color-otherFont-light)
        }
        .btn{
            padding-top: 30px;
            text-align: center;
            button {
                background: linear-gradient(90deg, #0096FF, #0024FF);
                color: #fff;
                line-height: 26px;
                margin-right: 23px;
                position: relative;
                overflow: hidden;
                width: 120px;
                height: 28px;
                border: none;
                border-radius: 19px;
                outline: none;
                cursor: pointer;
            }
            .disabled{
                background:#AAA;
                color: #fff;
                cursor: not-allowed;
            }
        }
    }
}
</style>