<template>
<div class="liquidation-page">
    <div class="app-container LiquidatedList">
        <div class="commin-title">
            <div class="title-inner">
                <img src="@/assets/pledge_tit.png" alt="">
                <span class="tit">My Liquidated Positions</span>
            </div>
        </div>
        <div class="app-inner">
                <div class="common-assets-list">
                    <div class="head">
                        <div class="kind">Pool</div>
                        <div class="return-rate">Position Size at Liquidation</div>
                        <div class="total">Returned Amount</div>
                        <div class="multiple">Tx Record</div>
                    </div>  
                    <!-- <div 
                        class="body"
                        >
                        <div 
                            v-for="(item , index) in TokenList"
                            :key="index"
                            v-loading="item.loading"
                            class="item" >
                            <div class="kind">
                                <img src="@/assets/bnb_token.png" alt="">
                                <img src="@/assets/usdt.png" class="img2">
                                <div class="infobox">
                                    <span class="name">H2O-BUSD</span>
                                    <span class="kindinfo">MDEX</span>
                                </div>
                            </div>
                            <div class="return-rate">
                                    <span class="bold">1274.98 BUSD</span>
                                   
                            </div>
                            <div class="total">
                                <p class="bold">9862.32 BUSD</p>
                            </div>
                            <div class="multiple">
                                <span >11137.30 BUSD</span>
                            </div>
                            <div class="risk">
                                <span class="num">73.22%</span>
                                <div class="progress">
                                    <div class="bar" :style="{'width':'73.22%'}"></div>
                                </div>
                            </div>
                            
                            <div class="opera">
                                <div class="live disabled" @click="toDetail(item)">Action</div>
                            </div>
                        </div>
                        
                    </div> -->
                    <div class="noresult">
                        There's nothing here
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
    <div class="app-container">
        <div class="commin-title">
            <div class="title-inner">
                <img src="@/assets/pledge_tit.png" alt="">
                <span class="tit">All</span>
            </div>
        </div>
        <div class="app-inner">
                <div class="common-assets-list">
                    <div class="head">
                        <div class="kind">Liquidation list</div>
                        <div class="return-rate">Supply value</div>
                        <div class="total">Loan value</div>
                        <div class="multiple">Redemption of liquid assets</div>
                        <div class="risk">Risk ratio</div>
                        <div class="opera">Action</div>
                    </div>  
                    <div 
                        class="body"
                        >
                        <!-- v-loading="listLoading" -->
                        <div 
                            v-for="(item , index) in TokenList"
                            :key="index"
                            v-loading="item.loading"
                            class="item" >
                            <div class="kind">
                                <img src="@/assets/bnb_token.png" alt="">
                                <img src="@/assets/usdt.png" class="img2">
                                <div class="infobox">
                                    <span class="name">H2O-BUSD</span>
                                    <span class="kindinfo">MDEX</span>
                                </div>
                            </div>
                            <div class="return-rate">
                                    <span class="bold">1274.98 BUSD</span>
                                   
                            </div>
                            <div class="total">
                                <p class="bold">9862.32 BUSD</p>
                            </div>
                            <div class="multiple">
                                <span >11137.30 BUSD</span>
                            </div>
                            <div class="risk">
                                <span class="num">73.22%</span>
                                <div class="progress">
                                    <div class="bar" :style="{'width':'73.22%'}"></div>
                                </div>
                            </div>
                            
                            <div class="opera">
                                <div class="live disabled" @click="toDetail(item)">Action</div>
                                <!-- <div class="pick">提取</div> -->
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
export default {
    name:'Liquidation',
    data(){
        return {
            TokenList:[
                {loading:false , curr:'H2O' , multiple : 1},
            ],
        }
    }
}
</script>
<style lang="scss" scoped>
.LiquidatedList {
    margin-bottom: 30px;
    .common-assets-list  {
        .head {
            >div {
                width: 25%;
            }
        }
    }
    .noresult {
        line-height: 60px;
        text-align: center;
        font-weight: 600;
        padding-top: 20px;
    }
}
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
                    flex-grow: 1;
                    .name{
                        font-size: 12px;
                    }
                    .kindinfo{
                        display: inline-block;
                        padding: 0 5px;
                        height: 16px;
                        line-height: 16px;
                        color: #002DFF;
                        border-radius: 3px;
                        margin-left: 8px;
                        background-color: rgba(0, 44, 255,.1);
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
                    // color: #1C1C1B;
                    @include mainFont($color-mainFont-light)

                }
            }
            .risk {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
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
                    font-weight: 600;
                    // color: #1C1C1B;
                    @include mainFont($color-mainFont-light)

               }
            }
            
            .opera{
                .live{
                    width: 90px;
                }
                .live.disabled{
                    background: #AAAAAA;
                    color: #fff;
                    border-color: #AAAAAA;
                }
            }
        }
    }
}
</style>