<template>
  <div class="pledge-mining-page">
    <div class="app-container">
      <div class="commin-title">
        <div class="title-inner">
          <img src="@/assets/pledge_tit.png" alt="" />
          <span class="tit">All Staking Pool</span>
          <!-- <div 
                        :class="[ 'btn' , {'active':activeNav === 'live'}]"
                        @click="changeNav('live')">Demand stake</div>
                    <div
                        :class="['btn',{'active':activeNav === 'ding'}]"
                        @click="changeNav('ding')">Time stake</div> -->
        </div>
      </div>
      <div class="app-inner">
        <div class="common-assets-list">
          <div class="head live" v-if="activeNav === 'live'">
            <div class="kind">Pool</div>
            <div class="days">APR</div>
            <div class="pledge">TVL</div>
            <div class="deposit">Deposited</div>
            <div class="reward">Reward</div>
            <div class="opera">Action</div>
          </div>
          <div class="head" v-else>
            <div class="kind">Pool</div>
            <div class="days">90-DAPY/Total stake</div>
            <div class="days">180-DAPY/Total stake</div>
            <div class="days">365-DAPY/Total stake</div>
            <div class="pledge">TVL</div>
            <div class="deposit">Deposited</div>
            <div class="reward">Reward</div>
            <div class="opera">Action</div>
          </div>
          <transition-group name="fade-transform" mode="out-in" tag="div">
            <div class="body" v-show="activeNav === 'live'" key="live">
              <div
                v-for="(item, index) in fixedList"
                :key="index"
                class="item live"
                v-loading="item.loading"
              >
                <div class="kind">
                  <div>
                    <img :src="currentTokenImage(item.name)" alt="" />
                    <span>{{ item.name_h }}</span>
                  </div>
                </div>
                <div class="return-rate">
                  <div>
                    <span class="bold green"
                      >{{ toFixed(item.YearPer || 0, 2) }}%</span
                    >
                  </div>
                </div>
                <div class="pledge">
                  <p class="bold">$ {{ toFixed(item.total, 6) || "--" }}</p>
                </div>
                <div class="deposit">
                  <span class="bold">{{ item.balance_h }}</span>
                  
                </div>
                <div>
                  <div class="reward">
                    <span class="bold"
                      >{{ toFixed(item.reward, 6) || "--" }}H2O</span
                    >
                    <el-tooltip effect="dark" placement="right">
                      <div slot="content">
                        <div v-loading="toolTipsLoading">
                          <div class="tooltipsItem">
                            <div class="left">
                              <img :src="currentTokenImage('H2O')" alt="" />
                              <span>H2O Vesting</span>
                            </div>
                            <div class="right">
                              <span class="amount">{{
                                toFixed(toolTips0, 6) || "--"
                              }}</span>
                              <span>H2O</span>
                            </div>
                          </div>
                          <div class="tooltipsItem">
                            <div class="left">
                              <img :src="currentTokenImage('H2O')" alt="" />
                              <span>H2O Claimable</span>
                            </div>
                            <div class="right">
                              <span class="amount">{{
                                toFixed(toolTips1, 6) || "--"
                              }}</span>
                              <span>H2O</span>
                            </div>
                          </div>
                        </div>
                        Vesting Schedule: 210 days linear vesting.<br />
                        Vesting once every days.<br />
                        Vesting starts once you harvest.<br />
                        Check and claim your vesting rewards at Claim page after
                        you harvest.
                      </div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                </div>
                <div class="opera ext">
                  <div class="btn" @click="toDetail('pl', item)">calim</div>
                  <div class="btn" @click="toDetail('pl', item)">Stake</div>
                  <div class="btn" @click="toDetail('un', item)">Unstake</div>
                </div>
              </div>
            </div>
            <div class="body" v-show="activeNav !== 'live'" key="ding">
              <div
                v-for="(item, index) in demandList"
                :key="index"
                class="item"
                v-loading="item.loading"
              >
                <div class="kind">
                  <div>
                    <img :src="currentTokenImage(item.name)" alt="" />
                    <span>{{ item.name_h }}</span>
                  </div>
                </div>
                <div class="return-rate days">
                  <div>
                    <span class="bold green"
                      >{{ toFixed(item.YearPer90 || 0, 2) }}%</span
                    >
                  </div>
                  <p>$ {{ item.total90 }}</p>
                </div>
                <div class="days">
                  <p class="bold green">
                    {{ toFixed(item.YearPer180 || 0, 2) }}%
                  </p>
                  <p class="bold">$ {{ item.total180 }}</p>
                </div>
                <div class="days">
                  <p class="bold green">
                    {{ toFixed(item.YearPer365 || 0, 2) }}%
                  </p>
                  <p class="bold">$ {{ item.total365 }}</p>
                </div>
                <div class="pledge">
                  <p class="bold">$ {{ toFixed(item.total, 6) || "--" }}</p>
                </div>
                <div class="deposit">
                  <p class="bold">{{ item.balance_h }}</p>
                </div>
                <div class="reward">
                  <p class="bold">
                    {{ toFixed(item.reward || 0, 6) || "--" }}H2O
                  </p>
                </div>
                <div class="opera">
                  <div class="live" @click="toDetail('pl', item)">Stake</div>
                  <div class="pick" @click="toDetail('un', item)">Unstake</div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
        <div class="common-page-outer">
          <el-pagination layout="prev, pager, next" :total="1"> </el-pagination>
        </div>
      </div>
    </div>
    <div class="app-container">
      <div class="commin-title IRO">
        <div class="title-inner">
          <img src="@/assets/pledge_tit.png" alt="" />
          <span class="tit">IRO Pool</span>
        </div>
        <div class="receiveBox">
          <span class="boxtit">Claim</span>
          <span class="num">{{ toFixed(IROreward, 6) || "--" }} H2O</span>
          <div
            :class="['btn', { disable: !Number(IROreward) }]"
            v-loading="receiveLoading"
            @click="receiveReward"
          >
            Claim
          </div>
        </div>
      </div>
      <div class="app-inner">
        <div class="common-assets-list IRO">
          <div class="body">
            <!-- v-loading='listLoading' -->
            <div class="item" v-loading="isNeedRefreshIRO">
              <div class="kind">
                <div>
                  <img :src="currentTokenImage('rH2O')" alt="" />
                  <span>rH2O</span>
                </div>
              </div>
              <div class="deposit">
                <div>
                  <span>Deposits</span>
                </div>
                <div>
                  <span class="bold">{{ IROBalance }} rH2O</span>
                </div>
              </div>

              <div class="opera">
                <div class="live" @click="toIRODetail('pl')">Stake</div>
                <div class="pick" @click="toIRODetail('un')">Unstake</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import imagePointer from "@/utils/images";
import { mapState } from "vuex";
import { getBalance } from "@/wallet/Inquire";
import { getIROReward } from "@/wallet/trade";
import PLEdGE from "@/wallet/pledge";
export default {
  name: "PledgeMining",
  data() {
    return {
      activeNav: "live",
      receiveLoading: false,
    };
  },
  watch: {
    isConnected: {
      immediate: true,
      handler(val) {
        if (val && !this.fixedList.length && !this.demandList.length) {
          setTimeout(() => {
            // this.$store.dispatch('DepositTokenList')
            this.$store.dispatch("pledgeTokenList");
          }, 300);
        }
      },
    },
    // isNeedRefreshIRO:{
    //     handler(val){
    //         if(val){
    //             this.IROInfo.loading = true
    //             this.getIRObalance()
    //             this.$store.commit('setIsNeedRefreshIRO' , false)
    //         }
    //     }
    // }
  },
  mounted() {
    // setTimeout(()=>{
    //     this.getIRObalance()
    // } , 300)
    // setTimeout(()=>{
    //     this.$store.dispatch('pledgeTokenList')
    // } , 300)
    console.log("IROPid", PLEdGE.IROPid);
  },
  computed: {
    ...mapState({
      isConnected: (state) => state.base.isConnected,
      isNeedRefreshIRO: (state) => state.base.IRO.isNeedRefresh,
      IROBalance: (state) => state.base.IRO.balance,
      IROaddress: (state) => state.base.IRO.address,
      IROreward: (state) => state.base.IRO.reward,
      fairLaunchAddress: (state) => state.base.fairLaunchAddress,
      mainTheme: (state) => state.comps.mainTheme,
      fixedList: (state) => state.base.pledgeList.fixed,
      demandList: (state) => state.base.pledgeList.demand,
    }),
  },
  methods: {
    currentTokenImage(token) {
      let point = this.mainTheme === "light" ? "L" : "D";
      return imagePointer[token] && imagePointer[token][point]
        ? imagePointer[token][point]
        : imagePointer.default;
    },

    changeNav(val) {
      this.activeNav = val;
    },
    // async getIRObalance(){
    //     let balance = await getBalance(this.IROaddress , 18 , this.fairLaunchAddress)

    //     this.IROInfo.balance = balance
    //     this.IROInfo.loading = false
    // },
    toDetail(route, item) {
      // let address = route === 'pl'?item.address:item.address_h
      // let decimals = route === 'pl'?item.decimals : item.decimals_h

      if (!item.address_h)
        return this.$notify.error({
          message: "Failed to get data, please refresh and try again",
          duration: 6000,
        });

      // this.$store.commit('setDepositCurrent' , item.address)
      let query = {
        token: item.address_h,
        decimals: item.decimals_h,
        name: item.name_h,
        originName: item.name,
        demand: this.activeNav === "live" ? item.name_h : false,
      };
      if (this.activeNav !== "live") {
        query.D90 = item.D90;
        query.D180 = item.D180;
        query.D365 = item.D365;
        query.YearPer365 = item.YearPer365;
        query.YearPer180 = item.YearPer180;
        query.YearPer90 = item.YearPer90;
      } else {
        query.pId = item.pId;
        query.YearPer = item.YearPer;
      }

      if (route === "un") {
        query.reward = item.reward;
      }
      sessionStorage.setItem("plInfo", JSON.stringify(query));
      this.$router.push({
        path: "/pledgeMint/detail",
        query: {
          type: route,
          // kind:item.name ,
          // token:address,
          // decimals,
        },
      });
    },
    toIRODetail(route) {
      sessionStorage.setItem(
        "plInfo",
        JSON.stringify({
          token: this.IROaddress,
          decimals: 18,
          name: "rH2O",
          originName: "rH2O",
          demand: "rH2O",
          pId: PLEdGE.IROPid,
        })
      );

      this.$router.push({
        path: "/pledgeMint/detail",
        query: {
          type: route,
          kind: "IRO",
        },
      });
    },
    receiveReward() {
      if (this.receiveLoading || !Number(this.IROreward)) return;
      this.receiveLoading = true;
      getIROReward(PLEdGE.IROPid)
        .then(() => {
          this.$store.dispatch("getRTokenBalance");
        })
        .finally(() => {
          this.receiveLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.commin-title {
  .btn {
    display: inline-block;
    padding: 0 17px;
    height: 30px;
    // border: 1px solid #333333;
    // color: #333333;
    border-style: solid;
    border-width: 1px;
    border-radius: 15px;
    line-height: 28px;
    vertical-align: middle;
    margin-left: 8px;
    cursor: pointer;
    position: relative;
    @include commonbtn($commonbtn-light);
    box-sizing: border-box;
  }
  .btn.active {
    background: linear-gradient(90deg, #0096ff, #0024ff);
    color: #fff;
    // border-color: transparent;
    border: none;
    line-height: 30px;
  }
  .tit {
    padding-right: 14px;
    display: inline-block;
  }
}
.commin-title.IRO {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  padding-right: 23px;
  font-size: 14px;
  .boxtit {
    color: #999999;
    font-weight: 600;
    display: inline-block;
    margin-right: 10px;
  }
  .num {
    font-weight: 600;
  }
  .btn {
    display: inline-block;
    width: 72px;
    height: 32px;
    background: linear-gradient(90deg, #0096ff, #0024ff);
    border-radius: 15px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    margin-left: 15px;
    cursor: pointer;
    border: none;
  }
  .btn.disable {
    @include enterDisabled($enterDisabled-light);
    color: #fff;
    cursor: not-allowed;
  }
}
.common-assets-list {
  .head {
    > div {
      width: 20%;
    }
    .days {
      width: 14%;
    }
    .opera {
      width: 20%;
    }
  }
  .head.live {
    > div {
      width: 20%;
    }
    .opera {
      width: 20%;
    }
  }
  .body {
    .item {
      > div {
        width: 20%;

        .reward {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          color: black;
        }

      }
       .deposit{
        }

      .days {
        width: 14%;
      }
      .opera {
        width: 20%;
      }
    }
    .item.live {
      > div {
        width: 20%;
      }
      .opera.ext {
        width: 20%;
        display: flex;
        justify-content: space-between;
        .btn {
          cursor: pointer;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          border-radius: 15px;
          color: #0024ff;
          border: 1px solid #0024ff;
        }
      }
    }
  }
}
.common-assets-list.IRO {
  .body {
    .item {
      > div {
        width: 42%;
      }
      .opera {
        width: 16%;
      }
    }
  }
}
</style>