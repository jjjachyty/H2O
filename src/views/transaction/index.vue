<template>
    <div class="transaction-page">
            <div class="trade-outer">
                <div class="title">
                    <div class="cnt">交换</div>
                    <div class="setting" @click="toggleShowSet"></div>
                    <div class="set-outer" v-if="showSetting">
                        <div class="dialog" @click="showSetting=false"></div>
                        <div class="innerSele">
                            <p class="tit">交易设置</p>
                            <div class="infotit">
                                <span>滑点公差</span>
                                <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tradeTip.png" alt="">
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="btn-area">
                                <div 
                                    v-for="(item) in btnsList "
                                    :key="item.val"
                                    :class="['btn',{'active':settingBtnActive === item.val}]"
                                    @click="perSetBtnClick(item.val)">
                                    {{item.label}}
                                </div>

                                <div :class="['inputarea',{'active':settingBtnActive === 'customize'}]" >
                                    <input 
                                        type="text"
                                        minLength="1"
                                        maxLength="79"
                                        v-model="SlippageVal" 
                                        placeholder="0.0"
                                        @focus="settingBtnActive = 'customize'"
                                        @input="inputEventForSetting($event)">
                                        <span>%</span>

                                </div>
                            </div>
                            <div class="infotit">
                                <span>交易截止日期</span>
                                <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tradeTip.png" alt="">
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="btn-area">
                                
                                <div :class="[ 'dayinput', 'inputarea']" >
                                    <input 
                                        type="text"
                                        minLength="1"
                                        maxLength="79"
                                        v-model="TimeLimit" 
                                        placeholder="1"
                                        @focus="settingBtnActive = 'customize'"
                                        @input="inputEventForTimeLimit($event)">

                                </div>
                                <div class="inputinfo">
                                    分钟
                                </div>
                            </div>
                            <p class="tit notFirst">界面设置</p>
                            <div class="infotitWithbtn">
                                <div class="infotit">
                                    <span>交易截止日期</span>
                                    <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                        <div class="inner">
                                            <img src="@/assets/tradeTip.png" alt="">
                                        </div>
                                    </el-tooltip>
                                </div>
                                <div class="multihops">
                                    <div :class="['on' , {'active':disableMultihops}]"
                                        @click="disableMultihops = true">
                                        on
                                    </div>
                                    <div :class="['off' , {'active':!disableMultihops}]"
                                        @click="disableMultihops = false">
                                        off
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="seleArea">
                    <div class="item"
                        v-for="(item,index) in tokenList"
                        :key="index">
                        <div class="inner">
                            <p class="info" v-if="index===0">From</p>
                            <p class="info" v-else>To</p>
                            <div class="sele">
                                <input 
                                    type="text"
                                    minLength="1"
                                    maxLength="79"
                                    v-model="item.val" 
                                    @input="inputEvent($event , index)">
                                <div class="token">
                                    <img :src="currentTokenImage(item.name)" alt="">
                                    <span class="name">{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="switchIcon" v-if="index===0" @click="toggleUp2Down">
                            <img src="@/assets/switchicon.png" alt="">
                        </div>
                    </div>

                </div>
                <div class="confirmBtn">
                    <button class="enter">
                        交换
                    </button>
                </div>
                <!-- <div class="tradeInfo" v-if="tokenList[0].val"> -->
                <div class="tradeInfo" >
                    <div class="item">
                        <div class="tit">价钱</div>
                        <div class="cnt">
                            <span>6881.59 H2O per BNB</span>
                            <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tardeInfoSwitch.png" alt="">
                                    </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">最小收到</div>
                        <div class="cnt">
                            <span>0.001585 BNB</span>
                            <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tradeTip.png" alt="">
                                    </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">价格影响</div>
                        <div class="cnt">
                            <span>0.0659 H2O</span>
                            <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tradeTip.png" alt="">
                                    </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item">
                        <div class="tit">路线</div>
                        <div class="cnt">
                            <span>
                                BTCB >
                                BUSD >
                                BNB
                            </span>
                            <el-tooltip  effect="dark" content="Left Top 提示文字" placement="left">
                                    <div class="inner">
                                        <img src="@/assets/tradeTip.png" alt="">
                                    </div>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import imagePointer from '@/utils/images'
import { mapState } from 'vuex'
export default {
    name:'transaction',
    data(){
        return {
            tokenList:[
                {name:'BNB' , val:'' },
                {name:'H2O' , val:'' }
            ],
            btnsList:[
                {label:'0.1%' , val:1},
                {label:'0.5%' , val:5},
                {label:'1%' , val:10},
            ],
            settingBtnActive:1,
            SlippageVal:'',
            showSetting:false,
            disableMultihops:true,
            TimeLimit:'1'
        }
    },
    computed:{
        ...mapState({
            mainTheme:state=>state.comps.mainTheme,
        })
    },
    methods:{
        toggleShowSet(){
            this.showSetting = !this.showSetting
        },
        currentTokenImage(token){
            let point = this.mainTheme === 'light' ? 'L':'D'
            return (imagePointer[token] && imagePointer[token][point]) ? imagePointer[token][point]:imagePointer.default
        },
        inputEvent(e , index){
            this.tokenList[index].val = this.$inputLimit(e , 6 , true)
        },
        inputEventForSetting(e ){
            this.SlippageVal = this.$inputLimit(e , 6 , true)
        },
        inputEventForTimeLimit(e){
            this.TimeLimit = this.$inputLimit(e , 0 , true)
        },
        toggleUp2Down(){
            this.tokenList.reverse()  
            this.tokenList[0].val = ''  
        },
        perSetBtnClick(val){
            this.settingBtnActive = val
        }
    }

}
</script>
<style lang="scss" scoped>
.trade-outer{
    border-radius: 20px;
    width: 480px;
    background-color: #fff; 
    margin: 0 auto;
    margin-top: 40px;
    box-shadow: rgba(0,0,0,0.01) 0px 0px 1px, rgb(0,0,0,0.04) 0px 4px 8px, rgb(0,0,0,0.04) 0px 16px 24px, rgb(0,0,0,0.01) 0px 24px 32px;
    padding: 20px;
    padding-bottom: 30px;
    .title{
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        .cnt{
            font-size: 14px;
            font-weight: 600;
        }
        .setting{
            width: 24px;
            height: 24px;
            background: url('~@/assets/settings.png') no-repeat;
            background-size: contain;
            cursor: pointer;
            position: relative;
            
        }
        .set-outer{
            position: absolute;
            top: calc(100% - 20px);
            right: 0px;
            padding-top: 40px;
            .dialog{
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0);
                z-index: 1003;
            }
            .innerSele{
                position: relative;
                width: 300px;
                // background-color: rgb(237, 238, 242);
                background-color: #FFF;
                z-index: 1004;
                border-radius: 20px;
                padding: 24px;
                box-sizing: border-box;
                // box-shadow: rgba(0,0,0,0.04) 0px  24px 32px, rgb(0,0,0,0.04) 0px 4px 8px, rgb(0,0,0,0.04) 0px 16px 24px, rgb(0,0,0,0.01) 0px 24px 32px;
                box-shadow: rgba(0,0,0,0.14) 0px  14px 40px;
                .tit {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                .tit.notFirst{
                    margin-top: 10px;
                }
                .infotit{
                    padding-top: 10px;
                    >span {
                        display: inline-block;
                        vertical-align: middle;
                        color: #666666;
                        margin-right: 10px;
                    }
                    .inner {
                        display: inline-block;
                        vertical-align: middle;
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 12px;
                        background-color: rgba(153, 153, 153 , .2);
                        img {
                            width: 16px;
                            height: 16px;
                            margin-top: 4px;
                        }
                    }
                }
                .btn-area {
                    display: flex;
                    margin-top: 12px;
                    .btn {
                        width: 50px;
                        height: 24px;
                        border-style: solid;
                        border-width: 1px;
                        // border: 1px solid #333333;
                        // color: #333333;
                        text-align: center;
                        line-height: 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        margin-right: 6px;
                        @include commonbtn($commonbtn-light);
                    }
                    .btn.active {
                        // border: 1px solid #0031FF;
                        // color: #0031FF;
                        @include btnBorderColor($color-btnBorderColor-light)
                    }
                    .inputarea{
                        justify-self: end;
                        border: 1px solid #333333;   
                        border-radius: 12px; 
                        flex-grow: 1;
                        width: 60px;
                        input {
                            width: calc(100% - 20px);
                            height: 24px;
                            padding: 0;
                            outline: none;
                            padding-left: 10px;
                            box-sizing: border-box;
                            text-align: right;
                            border: none;
                            background-color: transparent;
                            color: inherit;
                        }
                    }
                    .inputarea.active {
                        @include btnBorderColor($color-btnBorderColor-light)
                    }
                    .inputarea.error{

                    }
                    .dayinput{
                        width: 80px;
                        flex-grow: 0;
                        border: none;
                        input {
                            width: 100%;
                            padding-right: 10px;
                            box-sizing: border-box;
                            border: 1px solid #333333;
                            border-radius: 12px;
                        }
                        input:focus{
                            @include btnBorderColor($color-btnBorderColor-light)
                        }
                    }
                    .inputinfo{
                        line-height: 24px;
                        margin-left: 10px;
                    }
                }
                .infotitWithbtn{
                    display: flex;
                    justify-content: space-between;
                    .multihops{
                        display: flex;
                        flex-wrap: nowrap;
                        padding-top: 10px;
                        >div {
                            width: 42px;
                            height: 32px;
                            line-height: 32px;
                            text-align: center;
                            border-radius: 4px;
                        }
                        .on.active {
                            background: linear-gradient(90deg, #0096FF, #0024FF);
                            color: #fff;
                        }
                        .off.active {
                            background: rgb(86, 90, 105);
                            color: #FFF;
                        }
                    }
                }
            }
        }
        .setting:hover {
            background: url('~@/assets/setting_hover.png') no-repeat;
            background-size: contain;
        }
    }
    .seleArea{
        .item{
            .inner {
                background-color: rgba(0, 49, 255, 0.06);
                border-radius: 20px;
                border: 1px solid rgb(237, 238, 242);
                padding: 0 16px;
                .info{
                    margin: 10px 0;
                    color: #999999;
                }
                .sele{
                    height: 38px;
                    padding-bottom: 12px;
                    position: relative;
                    input {
                        width: calc(100% - 80px);
                        height: 38px;
                        padding: 0;
                        margin: 0;
                        border: none;
                        outline: none;
                        background-color: transparent;
                        font-size: 18px;
                        box-sizing: border-box;
                        vertical-align: middle;
                        @include balanceFont($balanceFont-light);
                        font-family: "Inter var", sans-serif;
                    }
                    .token{
                        width: 80px;
                        height: 38px;
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 38px;
                        img {
                            height: 28px;
                            width: 28px;
                            vertical-align: middle;
                            margin-right: 10px;
                        }
                        .name {
                            display: inline-block;
                            vertical-align: middle;
                            font-weight: 600;
                        }
                    }
                }
            }
            .switchIcon{
                height: 30px;
                width: 30px;
                margin: 0 auto;
                cursor: pointer;
                text-align: center;
                // background-color: rgba(0, 36, 255, 0.1);
                border-radius: 15px;
                img {
                    height: 20px;
                    margin-top: 5px;
                }
            }
            
        }
    }
    .confirmBtn{
        height: 40px;
        text-align: center;
        padding-top: 20px;
        .enter {
            background: linear-gradient(90deg, #0096FF, #0024FF);
            color: #fff;
            line-height: 36px;
            margin-right: 23px;
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 38px;
            border: none;
            border-radius: 19px;
            outline: none;
            cursor: pointer;
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
    }
    .tradeInfo{
        padding: 0 20px;
        padding-top: 10px;
        .item {
            display: flex;
            justify-content: space-between;
            line-height: 24px;
            margin-top: 4px;
            .tit{
                font-size: 14px;
                color: #666666;
            }
            .cnt {
                
                >span {
                    display: inline-block;
                    vertical-align: middle;
                    color: #666666;
                    margin-right: 10px;
                }
                .inner {
                    display: inline-block;
                    vertical-align: middle;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    border-radius: 12px;
                    background-color: rgba(153, 153, 153 , .2);
                    img {
                        width: 16px;
                        height: 16px;
                        margin-top: 4px;
                    }
                }
            }
        }

    }
}
</style>