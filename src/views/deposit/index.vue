<template>
    <div class="deposit">
        <div class="maininfo">
            <div class="Pledge">
                <div class="tit">
                    <img src="@/assets/deposit_tit.png" alt="">
                    <span>Total Value Locked</span>
                </div>
                <p class="num">$283,106,396.00</p>
            </div>
            <div class="audit">
                <div class="tit">
                    <img src="@/assets/deposit_safe.png" alt="">
                    <span>Security audit</span>
                </div>
                <div class="content">
                    <div class="item">
                        <img src="@/assets/deposit_safe_1.png" v-if="mainTheme==='light'" alt=""> 
                        <img src="@/assets/deposit_safe_1_light.png" v-else alt=""> 
                    </div>
                    <div class="item">
                        <img src="@/assets/deposit_safe_2.png" v-if="mainTheme==='light'" alt=""> 
                        <img src="@/assets/deposit_safe_2_light.png" v-else alt=""> 
                    </div>
                    <div class="item">
                        <img src="@/assets/deposit_safe_3.png" v-if="mainTheme==='light'" alt=""> 
                        <img src="@/assets/deposit_safe_3_light.png" v-else alt=""> 
                    </div>
                </div>
            </div>
        </div>
        <div class="app-container">
            <div class="commin-title">
                <div class="title-inner">
                    <img src="@/assets/pledge_tit.png" alt="">
                    <!-- <span class="tit">资产池</span> -->
                    <span class="tit">All Earning Pool</span>
                </div>
                
            </div>
            <div class="app-inner">
                <div class="common-assets-list">
                    <div class="head">
                        <!-- <div class="kind">币种</div>
                        <div class="return-rate">年化收益率(复利)</div>
                        <div class="total">总存</div>
                        <div class="borrow">总借</div>
                        <div class="use-rate">资金使用率</div>
                        <div class="balance">您的余额</div>
                        <div class="opera">操作</div> -->
                        <div class="kind">Pool</div>
                        <div class="return-rate">APY</div>
                        <div class="total">Total Deposit</div>
                        <div class="borrow">Total Borrowed</div>
                        <div class="use-rate">Utilization</div>
                        <div class="balance">Your Balance</div>
                        <div class="opera">Action</div>
                    </div>  
                    <div 
                        class="body"
                        >
                        <!-- v-loading="listLoading" -->
                        <div 
                            v-for="(item , index) in depositTokenList"
                            :key="index"
                            v-loading="item.balanceLoading"
                            class="item" >
                            <div class="kind">
                                <div>
                                    <img :src="currentTokenImage(item.name)" alt="" v-if="item.name==='H2O'">
                                    <img :src="currentTokenImage(item.name)" alt="" v-if="item.name==='BNB'">
                                    <span>{{item.name}}</span>
                                </div>
                            </div>
                            <div class="return-rate">
                                <div>
                                    <!-- <span class="bold">{{getNHSYL(item)}}</span> -->
                                    <span class="bold">
                                         <!-- <span>{{toFixed(Number(item.pledgeYear.YearPerMin) + Number(item.depositYear) ,2)|| '0.00'}}%</span>
                                        <span> ~ </span> -->
                                        <!-- <span>{{Math.pow((getTotalNumMax(item)/365)+1,365)-1}}</span> -->
                                        <span>{{toFixed(getTotalNumMax(item),2)|| '0.00'}}%</span>
                                    </span>
                                    <i class="el-icon-warning-outline">
                                        <span class="tips-outer">
                                            <span class="line">
                                                <!-- <span class="tit">存款年化收益率</span> -->
                                                <span class="tit">Lending APR</span>
                                                <span class="cnt">{{toFixed(item.depositYear ,2)|| '0.00'}}%</span>
                                            </span>
                                            <span class="line">
                                                <!-- <span class="tit">质押年化收益率</span> -->
                                                <span class="tit">Staking APR</span>
                                                <span class="cnt">
                                                    <!-- <span>{{toFixed(item.pledgeYear.YearPerMin ,2)|| '0.00'}}%</span>
                                                    <span> ~ </span> -->
                                                    <span>{{toFixed(item.pledgeYear.YearPerMax ,2)|| '0.00'}}%</span>
                                                </span>
                                            </span>
                                            <span class="line">
                                                <!-- <span class="tit">综合年化收益率</span> -->
                                                <span class="tit">Total APR</span>
                                                <span class="cnt">
                                                    <!-- <span>{{toFixed(Number(item.pledgeYear.YearPerMin) + Number(item.depositYear) ,2)|| '0.00'}}%</span>
                                                    <span> ~ </span> -->
                                                    <span>{{toFixed(getTotalNumMax(item) ,2)|| '0.00'}}%</span>
                                                </span>
                                            </span>
                                        </span>
                                    </i>

                                </div>
                            </div>
                            <div class="total">
                                <p class="bold">{{toFixed(item.total,2) || '--'}}</p>
                                <span>{{item.name}}</span>
                            </div>
                            <div class="borrow">
                                <p class="bold">{{toFixed(item.totalDebt,2) || '--'}}</p>
                                <span>{{item.name}}</span>
                            </div>
                            <div class="use-rate">
                                <span class="bold">{{toFixed(getZJSYL(item),2) || '--'}}%</span>
                            </div>
                            <div class="balance">
                                <p><span class="bold">{{toFixed(item.balance , 6) || '--'}}</span>{{item.name}}</p>
                                <p><span class="bold">{{toFixed(item.balance_h , 6) || '--'}}</span>{{item.name_h}}</p>
                            </div>
                            <div class="opera">
                                <div class="live" @click="toDetail('de', item)">Deposit</div>
                                <div class="pick" @click="toDetail('et', item)">Withdraw</div>
                                <!-- <div class="live" @click="toDetail('de', item)">存入</div>
                                <div class="pick" @click="toDetail('et', item)">提取</div> -->
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="common-page-outer">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="1">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
   
</template>
<script>
import imagePointer from '@/utils/images'
import { mapState } from 'vuex'
import { toolNumber } from '@/utils/tools'
export default {
    name:'Deposit',
    data(){
        return {
            // tokenList:[{
            //     kind:'H2O',
            //     rate:{
            //         de:'3.26%',
            //         pl:'6.32%',
            //         to:'8.75%'
            //     },
            //     return :'15.37%',
            //     total:'152.57k',
            //     borrow:'152.57k',
            //     use:'43.81%',
            //     balance:'0',
            //     hBalance:'0',
            //     balanceLoading:true
            // }],
            // listLoading:true,
        }
    },
    mounted(){
        // setTimeout(()=>{
        //    this.isConnected && this.$store.dispatch('DepositTokenList')
        //     // this.$store.dispatch('DepositTokenList')
        // },1000)
    },
    watch:{
        isConnected:{
            immediate:true,
            handler(val){
                if(val && !this.depositTokenList.length)  {
                    this.$store.dispatch('DepositTokenList').finally(()=> this.listLoading = false)
                }
            }
        },
        depositCurrentAddress:{
            handler(val){
                console.log('改变current',val)
                val && this.$store.dispatch('refreshListBalance',val)
            }
        }
    },
    computed:{
        ...mapState({
            depositTokenList:state=>state.base.depositTokenList,
            isConnected:state=>state.base.isConnected,
            depositCurrentAddress:state=>state.base.depositCurrentAddress,
            mainTheme:state=>state.comps.mainTheme,
        })
    },
    methods:{
        getTotalNumMax(item){
            let total = Number(item.pledgeYear.YearPerMax || 0) + Number(item.depositYear)
            // console.log('111111111111' , total);
            // console.log('item.pledgeYear.YearPerMax' , item.pledgeYear.YearPerMax);
            // console.log('item.depositYear' , item.depositYear);
            // console.log('item.total' , total);
            return total
        },
        getNHSYL(item){
            let ZH = item.pledgeYear.YearPerMin + item.depositYear 
            let ZHmax = item.pledgeYear.YearPerMax + item.depositYear 
            // let ZH = 3650
            let minrate = Math.pow(((ZH/36500)+1) , 365) - 1
            let maxrate = Math.pow(((ZHmax/36500)+1) , 365) - 1
            let min  = isNaN(minrate) ? 0 :  minrate*100
            let max  = isNaN(maxrate) ? 0 :  maxrate*100
            return this.toFixed(min , 2) + '% ~ ' + this.toFixed(max , 2)+'%'
        },
        getZJSYL(item){
            return item.total==='0' ? 0 : toolNumber(Number(item.totalDebt)/Number(item.total)*100)
        },
        toDetail(route , item){
            let address = route === 'de'?item.address:item.address_h
            let decimals = route === 'de'?item.decimals : item.decimals_h
            // let name = route === 'de'?item.name : item.name_h

            if(!address) return this.$notify.error({
                        message: '获取数据失败，请刷新后再试',
                        duration: 6000
                    });

            // this.$store.commit('setDepositCurrent' , item.address)
            sessionStorage.setItem('deInfo' , JSON.stringify({
                token:address,
                decimals , 
                name:item.name , 
                name_h:item.name_h,
                originToken:item.address,
                origindecimals:item.decimals
            }))
            this.$router.push({path:'/deposit/detail',query:{
                type:route , 
                // kind:item.name , 
                // token:address,
                // decimals,
            }})
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        }
        // async getTokenBalance(){
        //     this.tokenList[0].balanceLoading = true
        //     await this.$store.dispatch('getTokenBalance')
        //     await this.$store.dispatch('get_HTokenBalance' , '0x14fc237354fa2027a23b8e104d76c3b0ec4051e6')
        //     this.tokenList[0].balance = this.tokenBalance
        //     this.tokenList[0].hBalance = this.H_tokenBalance
        //     this.tokenList[0].balanceLoading = false
        // }
    }
}
</script>
<style lang="scss" scoped>
.maininfo {
    height: 150px;
    margin-bottom: 15px;
    display: flex;
    .Pledge {
        @include sideBarBgc($color-bgc-sideBar-light);
        
        width: calc(36% - 16px);
        margin-right: 16px;
    }
    .audit {
        @include sideBarBgc($color-bgc-sideBar-light);

        width: 64%;
        .content {
            display: flex;
            .item {
                height: 36px;
                // border: 1px solid #1C1C1B;
                border-style: solid;
                border-width: 1px;
                @include infoBoxBorder($infoBoxBorder-light);
                border-radius: 8px;
                width: 150px;
                margin-right: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 115px;
                    height: 29px;
                }
            }
        }
    }
    >div {
        background-color: #fff;
        border-radius: 38px;
        padding-left: 23px;
        box-sizing: border-box;
        .tit {
            font-size: 16px;
            font-weight: 600;
            line-height: 16px;
            margin: 28px 0 20px 0;
            @include mainFont($color-mainFont-light);

            img {
                height: 18px;
                vertical-align: middle;
                margin-right: 8px;
                position: relative;
                top: -2px;
            }
        }
        .num {
            font-size: 34px;
            margin: 0 ;
            font-weight: 600;
            color: #0024FF;
        }
    }
}


</style>