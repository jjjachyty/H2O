<template>
    <div class="app-container">
            <div class="commin-title">
                <div class="title-inner">
                    <img src="@/assets/pledge_tit.png" alt="">
                    <span class="tit">My Positions</span>
                    <div 
                        :class="[ 'btn' , {'active':activeNav === 'MDEX'}]"
                        @click="changeNav('MDEX')">MDEX</div>
                    <div
                        :class="['btn',{'active':activeNav === 'PS'}]"
                        @click="changeNav('PS')">PancakeSwap</div>
                </div>
            </div>
            <div class="position-content">
                <!-- <div class="tips" v-show="activeNav === 'MDEX'">
                    <img src="@/assets/warn-icon.png" alt="">
                    提示：MDEX奖励每小时更新一次
                </div> -->
                <transition-group name="fade-transform" mode="out-in" tag="div" :duration="{ enter: 500, leave: 0 }" v-loading="listloading" >
                    <div 
                        class="tokenList"
                        v-show="activeNav === 'MDEX'"
                        key="MDEX" >
                        <div 
                            class="item"
                            v-for="(item , index) in MDEXpositions"
                            :key="index"
                            v-loading="item.loading"
                            >
                            <div class="title">
                                <div class="main">
                                    <img class="first" :src="currentTokenImage(item.name0)" alt="">
                                    <img class="last" :src="currentTokenImage(item.name1)" alt="">
                                    <span>{{item.name0}}/{{item.name1}}</span>
                                </div>
                                <div class="receive">
                                    <div class="rcitem">
                                        <span class="tit">MDX Reward：</span>
                                        <span class="num">{{toFixed(item.BNBReward , 6)}} MDX</span>
                                        <button
                                            :class="{'disabled':!Number(item.BNBReward)}"
                                            :disabled="!Number(item.BNBReward)"
                                            v-loading="item.BNBLoading"
                                            @click="harvest(item)">
                                            Claim
                                        </button>
                                    </div> 
                                    <div class="rcitem">
                                        <span class="tit">H2O Reward：</span>
                                        <span class="num">{{toFixed(Number(item.H2OReward )*0.7 , 6)}} H2O</span>
                                        <el-tooltip effect="dark"  placement="right">
                                            <div slot="content">
                                                <div v-loading="toolTipsLoading" >
                                                    <div class="tooltipsItem">
                                                        <div class="left">
                                                            <img :src="currentTokenImage('H2O')" alt="">
                                                            <span>H2O Vesting</span>
                                                        </div>
                                                        <div class="right">
                                                            <span class="amount">{{toFixed(toolTips0(item) ,6) || '--'}}</span>
                                                            <span>H2O</span>
                                                        </div>
                                                    </div>
                                                    <div class="tooltipsItem">
                                                        <div class="left">
                                                            <img :src="currentTokenImage('H2O')" alt="">
                                                            <span>H2O Claimable</span>
                                                        </div>
                                                        <div class="right">
                                                            <span class="amount">{{toFixed(toolTips1(item),6) || '--'}}</span>
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
                                        <button
                                            :class="{'disabled':!Number(item.H2OReward)}"
                                            :disabled="!Number(item.H2OReward)"
                                            v-loading="item.H2OLoading"
                                            @click="harvest(item , true)">
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="tablecnt">
                                <div class="thead">
                                    <div class="Position">Position Value</div>
                                    <div class="debt">Debt Value</div>
                                    <div class="redeem">Redeemable</div>
                                    <div class="return-rate">Yield (APY)</div>
                                    <div class="risk">Risk value</div>
                                    <div class="opera">Action</div>
                                </div>
                                <div class="tbody">
                                    <div class="Position">{{toFixed(item.amount.token1Total , 6)}} {{item.name1}}</div>
                                    <!-- <div class="Position">{{toFixed(totalValue(item) , 6)}} {{item.name1}}</div> -->
                                    <div class="debt">{{toFixed(item.amount.debtToken , 6)}} {{item.name1}}</div>
                                    <div class="redeem">{{toFixed(chuziValue(item), 6)}} {{item.name1}}</div>
                                    <div class="return-rate">
                                        <div>
                                            <span class="bold">{{getcomplexRate(item)}}%</span>
                                            <div class="icon-more">
                                                <div class="tips-outer">
                                                    <p class="title">Borrow Asset</p>
                                                    <div class="btns">
                                                        <div 
                                                            :class="['btn',{'active':item.curr === item.name0}]"
                                                            @click="changeItemTipsNav(item , item.name0)">
                                                            {{item.name0}}
                                                        </div>
                                                        <div 
                                                            :class="['btn',{'active':item.curr === item.name1}]"
                                                            @click="changeItemTipsNav(item , item.name1)">
                                                            {{item.name1}}
                                                        </div>
                                                    </div>
                                                    <div class="content">
                                                        <span class="line">
                                                            <span class="tit">Yield Farm APR：</span>
                                                            <span class="cnt">{{toFixed(item.amount.MDXYear , 2) || '--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">H2O Rewards APR：</span>
                                                            <span class="cnt">{{toFixed(item.amount.H2OYear , 2)||'--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Borrowing Interest：</span>
                                                            <span class="cnt red">{{getBorrowYear(item)}}</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Total APR：</span>
                                                            <span class="cnt">{{getYearRate(item)}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Daily APR：</span>
                                                            <span class="cnt">{{getDailyRate(item)}}%</span>
                                                        </span>
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            <span class="oldInfo">{{item.amount.oldyear}}</span>
                                        </div>
                                    </div>
                                    <div class="risk">
                                        <span>{{getRiskAmount(item)}}%</span>
                                        <div class="progress">
                                            <div class="bar" :style="{'width':getRiskAmount(item)+'%'}"></div>
                                        </div>
                                    </div>
                                    <div class="opera">
                                        <button @click="showDialogClick('redeem',item)">Redeem</button>
                                        <button @click="showDialogClick('coverup',item)">Margin call</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="noresult" v-if="!MDEXpositions.length&&!listloading">
                            There is no order at present
                        </div>
                    </div>
                    <div 
                        class="tokenList"
                        v-show="activeNav === 'PS'"
                        key="PS">
                        <div 
                            class="item"
                            v-for="(item , index) in PSpositions"
                            :key="index"
                            v-loading="item.loading"
                            >
                            <div class="title">
                                <div class="main">
                                    <img class="first" :src="currentTokenImage(item.name0)" alt="">
                                    <img class="last" :src="currentTokenImage(item.name1)" alt="">
                                    <span>{{item.name0}}/{{item.name1}}</span>
                                </div>
                                <div class="receive">
                                    <!-- <div class="rcitem">
                                        <span class="tit">MDX收益：</span>
                                        <span class="num">{{toFixed(item.BNBReward , 6)}} MDX</span>
                                        <button
                                            :class="{'disabled':!Number(item.BNBReward)}"
                                            :disabled="!Number(item.BNBReward)"
                                            v-loading="item.BNBLoading"
                                            @click="harvest(item)"
                                            >领取</button>
                                    </div>  -->
                                    <div class="rcitem">
                                        <span class="tit">H2O Reward：</span>
                                        <span class="num">{{toFixed(Number(item.H2OReward )*0.7, 6)}} H2O</span>
                                        <el-tooltip effect="dark"  placement="right">
                                            <div slot="content">
                                                <div v-loading="toolTipsLoading" >
                                                    <div class="tooltipsItem">
                                                        <div class="left">
                                                            <img :src="currentTokenImage('H2O')" alt="">
                                                            <span>H2O Vesting</span>
                                                        </div>
                                                        <div class="right">
                                                            <span class="amount">{{toFixed(toolTips0(item) ,6) || '--'}}</span>
                                                            <span>H2O</span>
                                                        </div>
                                                    </div>
                                                    <div class="tooltipsItem">
                                                        <div class="left">
                                                            <img :src="currentTokenImage('H2O')" alt="">
                                                            <span>H2O Claimable</span>
                                                        </div>
                                                        <div class="right">
                                                            <span class="amount">{{toFixed(toolTips1(item),6) || '--'}}</span>
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
                                        <button
                                            :class="{'disabled':!Number(item.H2OReward)}"
                                            :disabled="!Number(item.H2OReward)"
                                            v-loading="item.H2OLoading"
                                            @click="harvest(item , true)"
                                            >Claim</button>
                                    </div>
                                </div>
                            </div>
                            <div class="tablecnt">
                                <div class="thead">
                                    <div class="Position">Position Value</div>
                                    <div class="debt">Debt Value</div>
                                    <div class="redeem">Redeemable</div>
                                    <div class="return-rate">Yield (APY)</div>
                                    <div class="risk">Risk value</div>
                                    <div class="opera">Action</div>
                                </div>
                                <div class="tbody">
                                    <div class="Position">{{toFixed(item.amount.token1Total , 6)}} {{item.name1}}</div>
                                    <!-- <div class="Position">{{toFixed(totalValue(item), 6)}} {{item.name1}}</div> -->
                                    <div class="debt">{{toFixed(item.amount.debtToken , 6)}} {{item.name1}}</div>
                                    <div class="redeem">{{toFixed(chuziValue(item), 6)}} {{item.name1}}</div>
                                    <div class="return-rate">
                                        <div>
                                            <span class="bold">{{getcomplexRate(item)}}%</span>
                                            <div class="icon-more">
                                                <div class="tips-outer">
                                                    <p class="title">Borrow Asset</p>
                                                    <div class="btns">
                                                        <div 
                                                            :class="['btn',{'active':item.curr === item.name0}]"
                                                            @click="changeItemTipsNav(item , item.name0)">
                                                            {{item.name0}}
                                                        </div>
                                                        <div 
                                                            :class="['btn',{'active':item.curr === item.name1}]"
                                                            @click="changeItemTipsNav(item , item.name1)">
                                                            {{item.name1}}
                                                        </div>
                                                    </div>
                                                    <div class="content">
                                                        <span class="line">
                                                            <span class="tit">Yield Farm APR：</span>
                                                            <span class="cnt">{{toFixed(item.amount.MDXYear , 2) || '--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">H2O Rewards APR：</span>
                                                            <span class="cnt">{{toFixed(item.amount.H2OYear , 2)||'--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Borrowing Interest：</span>
                                                            <span class="cnt red">{{getBorrowYear(item)}}</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Total APR：</span>
                                                            <span class="cnt">{{getYearRate(item)}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Daily APR：</span>
                                                            <span class="cnt">{{getDailyRate(item)}}%</span>
                                                        </span>
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            <span class="oldInfo">{{item.amount.oldyear}}</span>
                                        </div>
                                    </div>
                                    <div class="risk">
                                        <span>{{getRiskAmount(item)}}%</span>
                                        <div class="progress">
                                            <div class="bar" :style="{'width':getRiskAmount(item)+'%'}"></div>
                                        </div>
                                    </div>
                                    <div class="opera">
                                        <button @click="showDialogClick('redeem',item)">Redeem</button>
                                        <button @click="showDialogClick('coverup',item)">Margin call</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div class="noresult" v-if="!PSpositions.length&&!listloading">
                            There is no order at present
                        </div>
                    </div>
                </transition-group>
            </div>
            <!-- <div class="common-page-outer">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="1000">
                    </el-pagination>
                </div> -->
            <Dialog
                v-if="showDialog"
                :show.sync="showDialog"
                :kind="dialogKind"
                :info="editingData"
                />
    </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { getPositionRewardH2O , getPositionRewardBNB} from '@/wallet/trade'
import { getPledgeRewardInfo , getPledgeRewardInfo1 } from '@/wallet/Inquire'
import { mapState } from 'vuex'
import Dialog from './components/dialog.vue'
import { fromWei } from '@/utils/tools' 
export default {
    name:'Position',
    components:{ Dialog },
    data(){
        return{
            activeNav:'MDEX',
            showDialog:false,
            dialogKind:'coverup',
            editingData:{},
            // toolTips0:'',
            // toolTips1:'',
            toolTipsLoading:false,
        }
    },
    computed:{
        ...mapState({
            positions:state=>state.base.userPosition.list,
            isConnected:state=>state.base.isConnected,
            PositionFinish:state=>state.comps.positionFinish,
            listloading:state=>state.base.userPosition.loading,
            mainTheme:state=>state.comps.mainTheme,
        }),
        
        MDEXpositions(){
            return this.positions.filter(item=>item.type === 'MDEX')
        },
        PSpositions(){
            return this.positions.filter(item=>item.type === 'PS')
        }
    },
    watch:{
        isConnected:{
            immediate:true,
            handler(val){
                if(val && !this.positions.length)  {
                    this.$store.dispatch('getUserPosition')
                    // this.getRewardInfo()
                }
            }
        },
        PositionFinish:{
            handler(val){
                if(val){
                    this.showDialog = false
                    this.$store.commit('setPositionFinish',false)
                    this.$store.dispatch('getUserPosition')
                }
            }
        }
    },
    methods:{
        getcomplexRate(item){
            let daily = this.getDailyRate(item)
            return this.toFixed(Math.pow((1+(Number(daily)/1000000)) , 365) + 1 , 2)
        },
        getDailyRate(item){
            let year = this.getYearRate(item)
            return this.toFixed(Number(year) / 365 , 2) 
        },
        getYearRate(item){
            const {MDXYear = 0 , tradeFee = 0 , H2OYear=0 , depositYear0 , depositYear1 }  = item.amount
            let borrowYear 

            if(item.curr === item.name0){
                borrowYear =  depositYear0 
            }else {
                borrowYear = depositYear1
            }
            let total = Number(MDXYear)+Number(tradeFee)+Number(H2OYear)+  Number(borrowYear)

            return this.toFixed(total, 2) || '0.00'
        },
        getBorrowYear(item){
            const { depositYear0 , depositYear1 }  = item.amount
            if(item.curr === item.name0){
                return this.toFixed(depositYear0 || 0 , 2) + '%'
            }else {
                return this.toFixed(depositYear1 || 0 , 2) + '%'
            }
        },
        changeItemTipsNav(item , name){
            this.$store.commit('setUserPositionCurr' , {posId:item.posId, name})
        },
        totalValue(item){
            let total = Number(fromWei(item.positionsValue , 18)) + Number(fromWei(item.totalValue , 18))
            let price = Number(item.amount.token2TokenPrice)
            return total
        },
        chuziValue(item){
            let total = Number(item.amount.token1Total) - Number(item.amount.debtToken)
            return this.toFixed(total , 6) || '--'
        },
        toolTips0(item){
            let reward = Number(item.H2OReward)*0.7
            return isNaN(reward) ? 0 : reward - (reward / 210)
        },
        toolTips1(item){
            let reward = Number(item.H2OReward)*0.7
            return isNaN(reward) ? 0 : reward / 210
        },
        async getRewardInfo(){
            this.toolTips0 = await getPledgeRewardInfo()
            this.toolTips1 = await getPledgeRewardInfo1()
            this.toolTipsLoading = false
        },
        getRiskAmount(item){
            const { debtToken , token1Total } = item.amount
            // let AllValueToken0 = this.totalValue(item)
            if(token1Total == '0') return 0

            return this.toFixed(debtToken / token1Total * 100 ,2 ) || 0

        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        changeNav(id){
            this.activeNav = id
        },
        showDialogClick(item , ele){
            this.dialogKind = item
            this.showDialog = true
            this.editingData = { ...ele }
        },
        harvest(item , isH2O){
            if(isH2O){
                this.$store.commit('togglePositionState' , { posId :item.posId , point:'H2OLoading' ,val:true })
                getPositionRewardH2O(item.pId).then(()=>{
                    this.$store.commit('togglePositionState' , { posId :item.posId , point:'H2OReward' ,val:0 })
                }).finally(()=>{
                    this.$store.commit('togglePositionState' , { posId :item.posId , point:'H2OLoading' ,val:false })
                })
            }else {
                this.$store.commit('togglePositionState' , { posId :item.posId , point:'BNBLoading' ,val:true })

                getPositionRewardBNB().then(()=>{
                    this.$store.commit('togglePositionState' , { posId :item.posId , point:'BNBReward' ,val:0 })
                }).finally(()=>{
                    this.$store.commit('togglePositionState' , { posId :item.posId , point:'BNBLoading' ,val:false })
                })

            }
        }
    }
}
</script>
<style lang="scss" scoped>
.app-container{
    padding-bottom: 30px;
}
.common-common-page-outer {
    padding-top: 18px;
}
.commin-title {
    .btn{
        display: inline-block;
        padding: 0 17px;
        height: 30px;
        // border: 1px solid #333333;
        // color: #333333;
        border-radius: 15px;
        line-height: 28px;
        vertical-align: middle;
        margin-left: 8px;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        @include commonbtn($commonbtn-light);
    }
    .btn.active {
        background:linear-gradient(90deg, #0096FF, #0024FF);
        color: #fff;
        // border-color: transparent;
        line-height: 30px;
        border: none;
    }
    .tit {
        padding-right: 14px;
        display: inline-block;
    }
}
.position-content{
    padding: 0 23px;
    .tips {
        padding: 0 15px;
        line-height: 44px;
        height: 44px;
        // background-color: rgba(255, 0, 0,.06);
        @include warnTipsBg($warnTipsBg-light);
        font-size: 14px;
        margin: 15px 0;
        border-radius: 8px;
        img {
            height: 14px;
            vertical-align: middle;
            margin-right: 8px;
            position: relative;
            top: -2px;
        }
    }
}
.noresult{
    line-height: 50px;
    text-align: center;
    font-weight: 600;
}
.tokenList {
    min-height: 50px;
    padding-top:20px;
    .item:nth-last-of-type(1){
        margin-bottom: 0;
    }
    .item {
        padding-bottom: 23px;
        border-bottom: 1px solid rgba(0, 0, 0 , .1);
        margin-bottom: 23px;
        .title {
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: space-between;
            .receive {
                display: flex;
                .rcitem {
                    margin-left: 30px;
                    .el-icon-question {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 10px;
                    }
                    .tit {
                        color: #666666;
                        font-size: 15px;
                    }
                    .num {
                        color: #0024FF;
                        font-size: 15px;
                        font-weight: 600;
                        margin-right: 12px;
                    }
                    span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    button{
                        height: 28px;
                        padding: 0 30px;
                        text-align: center;
                        color: #0024FF;
                        border: 1px solid #0024FF;
                        cursor: pointer;
                        vertical-align: middle;
                        border-radius: 15px;
                        @include sideBarBgc($color-bgc-sideBar-light);
                        // @include commonbtn($commonbtn-light);
                        ::v-deep{
                            .el-loading-mask{
                                border-radius: 13px;
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
                    button.disabled{
                        background: #AAAAAA;
                        color: #fff;
                        cursor: not-allowed;
                        border-color: #AAAAAA;
                        
                    }
                }
            }
            .main {
                img {
                    height: 23px;
                    vertical-align: middle;
                    position: relative;
                }
                .first {
                    z-index: 1;
                }
                .last {
                    margin-left: -11px;
                }
                span {
                    color: #1C1C1B;
                    font-size: 17px;
                    font-weight: 600;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 9px;

                }
            }
        }
        .tablecnt {
            padding: 15px;
            margin-top: 15px;
            padding-bottom: 23px;
            background-color: rgba(0, 0, 0 , .06);
            border-radius: 8px;
            font-size: 14px;
            .thead > div , .tbody > div {
                width: 20%;
            }
            .thead , .tbody {
                display: flex;
            }
            .thead {
                padding-bottom: 23px;
                color: #666666;
                font-weight: 600;
            }
            .tbody {
                min-height: 30px;
                line-height: 30px;
                >div {
                    // color: #1C1C1B;
                    font-size: 12px;
                    font-weight: 600;
                    @include mainFont($color-mainFont-light)
                }
                .return-rate{
                    .bold{
                        font-size: 14px;
                        color: #00B23B;
                    }
                    .oldInfo{
                        color: #999999;
                        text-decoration: line-through;
                    }
                    .icon-more{
                        background: url('~@/assets/total_info.png') no-repeat;
                        width: 12px;
                        height: 12px;
                        display: inline-block;
                        position: relative;
                        background-size: cover;
                        z-index: 1;
                        .tips-outer{
                            display: none;
                            position: absolute;
                            width: 240px;
                            @include sideBarBgc($color-bgc-sideBar-light);
                            box-shadow: 0px 0px 8px 0px rgba(0,0,0,.2);
                            padding: 15px;
                            color: #333;
                            border-radius: 8px;
                            z-index: 999;
                            left: 12px;
                            .title{
                                margin: 0;
                                color: #333;
                            }
                            .btns {
                                margin-top: 7px;
                                display: flex;
                                .btn {
                                    height: 23px;
                                    line-height: 23px;
                                    width: 60px;
                                    border: 1px solid #333333;
                                    color: #333333;
                                    border-radius: 13px;text-align: center;
                                    margin-right: 8px;
                                    cursor: pointer;
                                }
                                .btn.active {
                                    color: #0024FF;
                                    border: 1px solid #0024FF;
                                }
                            }
                            .content{
                                .line{
                                    display: flex;
                                    justify-content: space-between;
                                    margin-top: 12px;
                                    line-height: 14px;
                                    .cnt {
                                        color: #00B23B;
                                    }
                                    .cnt.red{
                                        color: #f00;
                                    }
                                }
                            }
                        }
                    }
                    .icon-more:hover .tips-outer{
                        display: block;
                    }
                }
                .opera {
                    
                    button {
                        background-color: transparent;
                        height: 28px;
                        border: 1px solid #0024FF;
                        border-radius: 15px;
                        color: #0024FF;
                        padding: 0 10px;
                        font-size: 15px;
                    }
                    button:nth-of-type(1){
                        margin-right: 8px;
                    }
                }
                .risk {
                    span {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .progress {
                        display: inline-block;
                        width: 75px;
                        height: 8px;
                        border-radius: 4px;
                        background-color: #D3D3D3;
                        vertical-align: middle;
                        margin-left: 12px;
                        position: relative;
                        overflow: hidden;
                        .bar {
                            position: absolute;
                            height: 8px;
                            left: 0;
                            top: 0;
                            background-color: #00B23B;
                            border-radius: 4px;
                        }
                    }
                }
            }
        }
    }
}
.el-icon-question {
    color: rgba(0, 49, 255, 0.6);
}

</style>