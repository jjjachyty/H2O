<template>
    <div class="app-container">
            <div class="commin-title">
                <div class="title-inner">
                    <img src="@/assets/pledge_tit.png" alt="">
                    <span class="tit">Leveraged Farms</span>
                    <div class="subNav">
                        <div 
                            :class="['item',{'active':subNav[mintTopNavCurrent] === item.id}]"
                            v-for="(item , index) in subNavList"
                            :key="index"
                            @click="changeSubNav(item)">
                            <div class="inner">
                                <img v-if="item.img1" :src="item.img1" class="img1">
                                <img v-if="item.img2" :src="item.img2" class="img2">
                                <span>{{item.label}}</span>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="app-inner">
                <div class="common-assets-list">
                    <div class="head">
                        <div class="kind">Pool</div>
                        <div class="return-rate">Yield (APY)</div>
                        <div class="total">TVL</div>
                        <div class="multiple">Leverage</div>
                        <div class="opera">Action</div>
                    </div> 
                        <transition-group name="fade-transform" mode="out-in" tag="div" :duration="{ enter: 500, leave: 0 }" >
                            <div class="body" v-show="mintTopNavCurrent === 'All'" key="All">
                                <!-- v-loading="listLoading" -->
                                <div 
                                    v-for="(item , index) in AllList"
                                    :key="index"
                                    v-loading="item.loading"
                                    class="item" >
                                    <div class="kind">
                                        <img :src="currentTokenImage(item.name0)" alt="">
                                        <img :src="currentTokenImage(item.name1)" class="img2">
                                        <div class="infobox">
                                            <span class="name">{{item.name0}}-{{item.name1}}</span>
                                            <span class="kindinfo">{{item.type ==='MDEX' ? "MDEX" :"PancakeSwap"}}</span>
                                            <!-- <div class="bottom">

                                                <span class="tag ora">全新</span>
                                                <span class="tag" v-if="item.type ==='MDEX'">双收益</span>
                                            </div> -->
                                        </div>
                                    </div>
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
                                                        <span class="line" >
                                                            <span class="tit">Yield Farm APR：</span>
                                                            <span class="cnt">{{toFixed(item.info.MDXYear , 2) || '--'}}%</span>
                                                        </span>
                                                        <span class="line" v-if="item.type ==='PS'">
                                                            <span class="tit">Trading Fees：</span>
                                                            <span class="cnt">{{toFixed(item.info.tradeFee ,2)||'--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">H2O Rewards APR：</span>
                                                            <span class="cnt">{{toFixed(item.info.H2OYear  , 2) || '--'}}%</span>
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
                                            <span class="oldInfo">{{item.info.oldyear}}</span>
                                        </div>
                                    </div>
                                    <div class="total">
                                        <p class="bold">$ {{toFixed(item.info.allMintNum||0 , 6)}}</p>
                                    </div>
                                    <div class="multiple">
                                        <img @click="multiplePlus(item)" src="@/assets/plus.png" alt="">
                                        <span >{{item.multiple}}</span>
                                        <img @click="multipleReduce(item)" src="@/assets/reduce.png" alt="">
                                    </div>
                                    
                                    <div class="opera">
                                        <div class="live" @click="toDetail(item)">{{item.multiple}}x Farm</div>
                                        <!-- <div class="pick">提取</div> -->
                                    </div>
                                </div>
                                <div class="noresult" v-if="!AllList.length&&!listloading">
                                    There's nothing here
                                </div>
                            </div>
                            <div class="body" v-show="mintTopNavCurrent === 'PS'" key="PS">
                                <!-- v-loading="listLoading" -->
                                <div 
                                    v-for="(item , index) in PSList"
                                    :key="index"
                                    v-loading="item.loading"
                                    class="item" >
                                    <div class="kind">
                                        <img :src="currentTokenImage(item.name0)" alt="">
                                        <img :src="currentTokenImage(item.name1)" class="img2">
                                        <div class="infobox">
                                            <span class="name">{{item.name0}}-{{item.name1}}</span>
                                            <span class="kindinfo">PancakeSwap</span>
                                            <!-- <div class="bottom">

                                                <span class="tag ora">全新</span>
                                                <span class="tag">双收益</span>
                                            </div> -->
                                        </div>
                                    </div>
                                    <div class="return-rate">
                                        <div>
                                            <span class="bold">{{getcomplexRate(item)}}</span>
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
                                                            <span class="cnt">{{toFixed(item.info.MDXYear , 2) || '--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">Trading Fees：</span>
                                                            <span class="cnt">{{toFixed(item.info.tradeFee ,2)||'--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">H2O Rewards APR：</span>
                                                            <span class="cnt">{{toFixed(item.info.H2OYear  , 2)||'--'}}%</span>
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
                                            <span class="oldInfo">{{item.info.oldyear}}</span>
                                        </div>
                                    </div>
                                    <div class="total">
                                        <p class="bold">$ {{toFixed(item.info.allMintNum||0 , 6)}}</p>
                                    </div>
                                    <div class="multiple">
                                        <img @click="multiplePlus(item)" src="@/assets/plus.png" alt="">
                                        <span >{{item.multiple}}</span>
                                        <img @click="multipleReduce(item)" src="@/assets/reduce.png" alt="">
                                    </div>
                                    
                                    <div class="opera">
                                        <div class="live" @click="toDetail(item)">{{item.multiple}}x Farm</div>
                                        <!-- <div class="pick">提取</div> -->
                                    </div>
                                </div>
                                <div class="noresult" v-if="!PSList.length&&!listloading">
                                    There's nothing here
                                </div>
                            </div>
                            <div class="body" v-show="mintTopNavCurrent === 'MDEX'" key="MDEX">
                                <!-- v-loading="listLoading" -->
                                <div 
                                    v-for="(item , index) in MDEXList"
                                    :key="index"
                                    v-loading="item.loading"
                                    class="item" >
                                    <div class="kind">
                                        <img :src="currentTokenImage(item.name0)" alt="">
                                        <img :src="currentTokenImage(item.name1)" class="img2">
                                        <div class="infobox">
                                            <span class="name">{{item.name0}}-{{item.name1}}</span>
                                            <span class="kindinfo">MDEX</span>
                                            <!-- <div class="bottom">

                                                <span class="tag ora">全新</span>
                                                <span class="tag">双收益</span>
                                            </div> -->
                                        </div>
                                    </div>
                                    <div class="return-rate">
                                        <div>
                                            <span class="bold">{{getcomplexRate(item)}}</span>
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
                                                            <span class="cnt">{{toFixed(item.info.MDXYear , 2) || '--'}}%</span>
                                                        </span>
                                                        <span class="line">
                                                            <span class="tit">H2O Rewards APR：</span>
                                                            <span class="cnt">{{toFixed(item.info.H2OYear , 2)||'--'}}%</span>
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
                                            <span class="oldInfo">{{item.info.oldyear}}</span>
                                        </div>
                                    </div>
                                    <div class="total">
                                        <p class="bold">$ {{toFixed(item.info.allMintNum||0 , 6)}}</p>
                                    </div>
                                    <div class="multiple">
                                        <img @click="multiplePlus(item)" src="@/assets/plus.png" alt="">
                                        <span >{{item.multiple}}</span>
                                        <img @click="multipleReduce(item)" src="@/assets/reduce.png" alt="">
                                    </div>
                                    
                                    <div class="opera">
                                        <div class="live" @click="toDetail(item)">{{item.multiple}}x Farm</div>
                                        <!-- <div class="pick">提取</div> -->
                                    </div>
                                </div>
                                <div class="noresult" v-if="!MDEXList.length&&!listloading">
                                    There's nothing here
                                </div>
                            </div>
                        </transition-group>
                </div>
                <div class="common-page-outer">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="1">
                    </el-pagination>
                </div>
            </div>
        </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { mapGetters, mapState } from 'vuex'
export default {
    name:'totalMinting',
    data(){
        return {
            TokenList:[
                {loading:false , curr:'H2O' , multiple : 1},
                // {loading:false , },
                // {loading:false , },
            ],
            subNavList:[
                {id:'1' ,label:'All'},
                {id:'2' ,label:'STABLE' ,img1:require('@/assets/bnb_token.png') , img2:require('@/assets/usdt.png')},
                {id:'3' ,label:'H2O' , img1:require('@/assets/fire.png')},
            ],
            subNav:{
                All:'1',
                PS:'1',
                MDEX:'1'
            },
            AllList:[],
            PSList:[],
            MDEXList:[]
        }
    },
    computed:{
        ...mapState({
            isConnected:state=>state.base.isConnected,
            allMintList:state=>state.base.totalMint.list,
            mintTopNavCurrent:state=>state.base.mintTopNavCurrent,
            listloading:state=>state.base.totalMint.loading,
            mainTheme:state=>state.comps.mainTheme,

        }),
        ...mapGetters(['PSMintingList' , 'MDEXMintingList']),

    },
    watch:{
        isConnected:{
            immediate:true,
            handler(val){
                if(val && !this.allMintList.length)  {
                    this.$store.dispatch('getMintListInfo')
                }
            }
        },
        allMintList:{
            immediate:true,
            handler(){
                this.AllList = this.allMintList
                this.PSList = this.PSMintingList
                this.MDEXList = this.MDEXMintingList
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
            const {MDXYear = 0 , tradeFee = 0 , H2OYear=0 }  = item.info
            let borrowYear 

            if(item.curr === item.name0){
                borrowYear =  item.depositYear0 
            }else {
                borrowYear = item.depositYear1
            }

            let tradeF = item.type ==='PS' ? Number(tradeFee) : 0
            let total = Number(MDXYear)+tradeF+Number(H2OYear)+  Number(borrowYear)

            return this.toFixed(total, 2) || '0.00'
        },
        getBorrowYear(item){
            if(item.curr === item.name0){
                return this.toFixed(item.depositYear0 || 0 , 2) + '%'
            }else {
                return this.toFixed(item.depositYear1 || 0 , 2) + '%'
            }
        },
        changeItemTipsNav(item , name){
            this.$store.commit('setTotalMintCurr' , {id:item.id, name})
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        toDetail(item){
            sessionStorage.setItem('mintInfo' , JSON.stringify({
                token0:item.token0,
                token1:item.token1, 
                name0:item.name0 , 
                name1:item.name1 ,
                decimals0:item.decimals0,
                decimals1:item.decimals1,
                borrowList:{token0:false , token1:true},
                type:item.type,
                posId:item.posId,
                multiple:item.multiple,
                BankBalance0:item.BankBalance0,
                BankBalance1:item.BankBalance1,
                strategyAdd:item.strategyAdd,
                complexRate:this.getcomplexRate(item),
                max:item.max,
                MAX:item.MAX,
                MIN:item.MIN
            }))
            this.$router.push({path:'totalMinting/detail'})
        },
        multiplePlus(item){
            if(item.id){
                this.$store.commit('setTotalMintItemMultiple',{id:item.id , type:1})
            }
        },
        multipleReduce(item){
            if(item.id){
                this.$store.commit('setTotalMintItemMultiple',{id:item.id , type:2})
            }
        },
        changeSubNav(item) {
            this.subNav[this.mintTopNavCurrent] = item.id
            let stable = ['BUSD','USDT','USDC','DAI']
            let point = this.mintTopNavCurrent+'List'
            
            let list  = []
            if(this.mintTopNavCurrent ==="All"){
                list = this.allMintList
            }else if(this.mintTopNavCurrent ==="PS"){
                list = this.PSMintingList
            }else if(this.mintTopNavCurrent === "MDEX"){
                list = this.MDEXMintingList
            }

            switch  (item.id){
                case '2':
                    this[point] = list.filter(ele=>{
                        let index1 = stable.findIndex(ent=>ent===ele.name0)
                        let index2 = stable.findIndex(ent=>ent===ele.name1)
                        return (index1!==-1 || index2!==-1)
                    })
                    break;
                case '3':
                    this[point] = list.filter(ele=>{
                        return (ele.name0 === 'H2O' || ele.name1 === 'H2O')
                    })
                    break;
                default:
                    this[point] = list;
            }
            
        }
    }
}
</script>
<style lang="scss" scoped>
.common-assets-list {
    .head {
        >div {
            width: 22%;
        }
        .opera {
            width: 12%;
        }
    }
    .body {
        // position: absolute;
        // width: 100%;
        // top: 35px;
        min-height: 50px;
        .item {
            >div {
                width: 22%;
            }
            .opera {
                width: 12%;
            }
            .kind{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: row;
                img {
                    height: 15px;
                    width: 15px;
                    margin-right: 10px;
                    position: relative;
                    z-index: 2;
                }
                .img2{
                    margin-left: -14px;
                    z-index: 1;
                }
                .infobox{
                    // display: inline-block;
                    flex-grow: 1;
                    position: relative;
                    top: -2px;
                    .name{
                        font-size: 12px;
                    }
                    .kindinfo{
                        display: inline-block;
                        padding: 0 5px;
                        height: 16px;
                        line-height: 16px;
                        // color: #002DFF;
                        border-radius: 3px;
                        margin-left: 8px;
                        // background-color: rgba(0, 44, 255,.1);
                        @include tokenTagsBlue($tokenTagsBlue-light , $tokenTagsBlue-font-light)
                    }
                    .bottom{
                        margin-top: 8px;
                    }
                    .tag{
                        display: inline-block;
                        height: 14px;
                        border: 1px solid #666666;
                        border-radius: 3px;
                        line-height: 14px;
                        text-align: center;
                        min-width: 32px;
                        padding: 0 8px;
                        color: #666666;
                        margin-right: 5px;
                    }
                    .tag.ora {
                        border-color: #FF8A0C;
                        color: #FF8A0C;
                    }
                }
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
            .multiple{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                img {
                    width: 12px;
                    height: 12px;
                    vertical-align: middle;
                    cursor: pointer;
                }
                span {
                    display: inline-block;
                    width: 36px;
                    // color: #002DFF;
                    font-weight: bold;
                    text-align: center;
                    vertical-align: middle;
                    @include blueFont($blueFont-light);
                }
            }
            .opera{
                .live{
                    width: 90px;
                }
            }
           
        }
        .noresult{
            line-height: 50px;
            text-align: center;
            font-weight: 600;
        }
    }
}
.commin-title{
    .title-inner{
        display: flex;
        align-items: center;
        .subNav {
            height: 30px;
            display: flex;
            padding-left: 20px;
            .item {
                height: 30px;
                line-height: 24px;
                // border: 1px solid #333333;
                padding: 1px;
                border-radius: 15px;
                min-width: 70px;
                text-align: center;
                margin-right: 8px;
                box-sizing: border-box;
                // color: #333333;
                font-weight: normal;
                cursor: pointer;
                // background-color: #333333;
                @include commonbtn($commonbtn-light);
                @include subMenuPointBgc($color-subMenuPoint-light);
                .inner {
                    // background-color: #fff;
                    padding: 0  15px;
                    border-radius: 14px;
                    height: 100%;
                    width: 100%;
                    box-sizing: border-box;
                    @include sideBarBgc($color-bgc-sideBar-light)
                }
                img {
                    height: 15px;
                    vertical-align: middle;
                    margin-right: 8px;
                    position: relative;
                    z-index: 2;
                }
                .img2{
                    margin-left: -12px;
                    z-index: 1;
                }
                span {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .item.active{
                // border: 1px solid transparent;
                color: #fff;
                background: linear-gradient(90deg, #0096FF, #0024FF);
                .inner{
                    background-color: transparent;
                } 
            }
        }
    }
}
</style>