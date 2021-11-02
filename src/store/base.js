import {
    getOneLevelLists,
    getAirdropValue,
    getDecimals,
    getAirDropDrawed,
    getBalance,
    isApproved,
    getDepositTokenList,
    getHTokenAddress,
    getTokenHtokenBalance,
    getAllTokenName,
    getRewardBalance,
    getTokenDecimals,
    getUserPositionList,
    getPositionRewardBalance,
    getPositionRewardBalanceBNB,
    getRedeemLiquidityShares,
    getRedeemLiquidity,
    getLptoken,
    getLptokenTotalSupply,
    getLptokenReserves,
    getToken2TokenPrice,
    getAllTokenPosition,
    H2OYearIncomeFarm,
    getPledgeTokensBalance,
    getDepositTotal,
    getDepositTotalDebt,
    getYearRateFee,
    getPosition,
    getMintMaxAndMin
} from '@/wallet/Inquire'
import {
    deepCopy,
    fromWei,
    toolNumber
} from '@/utils/tools'
import tokenList from '@/wallet/tokens.js'
import pledgeList from '@/wallet/pledge.js'
import Web3 from 'web3'
import { getUserPosition } from '../wallet/Inquire'
let copyBaseState 







export default {
    state :{
        address:'',
        isConnected:false,
        accounts:'',
        chainId:'',
        airdropAddress:'0xd6aD3B772408A1d3AaA3831C2B074Dbf5c117169',
        airdropBalance:'--',
        inviteList:{
            list:[],
            loading:false
        },
        tokenDecimals:18,
        airDropDrawed:'--',
        tradeStatus:{
            current:"",
            list:[],
            SuccessHash:'',
            FailedHash:'',
            userDenyId:''
        },
        domainHostAddress:'https://testnet.bscscan.com/tx/',
        bankAddress:'0x29921F72822A235Fe760aF4B40F948D5031d9840',
        fairLaunchAddress:'0x0cB475969513333a60Ee0117866414b40251ad11',
        timeLockAddress:'0xfb22c6D2eCB6D2411870BD7877122916C3073001',
        
        depositTokenList:[],
        depositListLoading:false,
        depositCurrentAddress:'',
        IRO:{
            balance:'--',
            isNeedRefresh:true,
            address:'0x498ac7f836415A3AB06024D2BaD5f9cC4fD346ef',
            decimals:18,
            reward:0
        },
        totalMint:{
            list:[],
            loading:false,
            
        },
        pledgeList:{
            fixed:[],
            demand:[],
            loading:false,
        },
        userPosition:{
            list:[],
            loading:false,
        },


        mintTopNavCurrent:'All'
    },
    mutations: {
        setMintTopNavCurrent(state , val){
            state.mintTopNavCurrent = val
        },
        setUserPositionLoading(state ,val){
            state.userPosition.loading = val
        },
        reseUserPosition(state){
            state.userPosition.list = []
        },
        setDepositListLoading(state ,val){
            state.depositListLoading = val
        },
        setPledgeListLoading(state ,val){
            state.pledgeList.loading = val
        },
        setIRObalance(state , {balance , reward}){
            state.IRO.isNeedRefresh = false
            state.IRO.balance = balance
            state.IRO.reward = reward
        },
        setIsNeedRefreshIRO(state , val){
            state.IRO.isNeedRefresh = val
        },
        isConnected(state , val ){
            state.isConnected = val
        },
        disconnect(state){
          for(let key in state){
            if(key === 'accounts'){
              state[key] = ''
            }else [
              state[key] = copyBaseState[key]
            ]
          }
          console.log('state',state)
          
        },
        copyDefaultState(state){
            copyBaseState = deepCopy(state)
        },
        getChainId(state , value) {
            state.chainId = value;
        },
        getAddress(state, value) {
            state.address = value;
        },
        getAccounts(state, value) {
            state.accounts = value;
        },
        getAirdropBalance(state, value){
            state.airdropBalance = value
        },
        setInviteList(state  , value){
            state.inviteList.list = value
            state.inviteList.loading = false
        },
        setInviteListLoading(state , value){
            state.inviteList.loading = value
        },
        setTokenDecimals(state , value){
            state.tokenDecimals = value
        },
        setAirDropDrawed(state , value){
            state.airDropDrawed = value
        },
        createOrder(state , {id , val}){
            state.tradeStatus.list.push({id , val })
            state.tradeStatus.current = id
        },
        change_TradeStatus(state , {id , val , isUserDeny , hash}){
            if(!id) return 
            let index = state.tradeStatus.list.findIndex(item=>{
                return item.id === id
            })
            if(index !== -1){
                state.tradeStatus.list[index].val = val 
                state.tradeStatus.list[index].hash = hash // 1成功 2失败

                if(val === 1){
                    state.tradeStatus.SuccessHash = hash
                }else {
                    state.tradeStatus.list[index].isUserDeny = isUserDeny
                    if(isUserDeny){
                        state.tradeStatus.userDenyId = id
                        console.log('userDenyId' , state.tradeStatus.userDenyId);
                    }
                    state.tradeStatus.FailedHash = hash
                }
            }
        },
        setTokenList(state , list){
            state.depositTokenList = []
            list.forEach(item=>{
                state.depositTokenList.push({
                    address:item,
                    address_h:'',
                    name:'',
                    name_h:'',
                    decimals:18,
                    decimals_h:18,
                    balance:'',
                    balance_h:'',
                    depositYear:'',
                    totalDebt:'',
                    pledgeYear:'',
                    total:'',
                    balanceLoading:true
                })
            })
        },
        setPledgeList(state , {fixed , demand}){
            state.pledgeList.fixed = []
            fixed.forEach(item=>{
                state.pledgeList.fixed.push({
                    address:item.originToken,
                    address_h:item.token,
                    pId:item.pId,
                    name:'',
                    name_h:'',
                    decimals:18,
                    decimals_h:18,
                    balance:'',
                    balance_h:'',
                    reward:'',
                    total:'',
                    YearPer:'',
                    loading:true,
                })
            })


            state.pledgeList.demand = []
            demand.forEach(item=>{
                state.pledgeList.demand.push({
                    address:item.originToken,
                    address_h:item.token,
                    name:'',
                    D90:item.D90,
                    D180:item.D180,
                    D365:item.D365,
                    YearPer90:'',
                    YearPer180:'',
                    YearPer365:'',
                    name_h:'',
                    decimals:18,
                    decimals_h:18,
                    balance:'',
                    balance_h:'',
                    // balance90:'',
                    // balance180:'',
                    // balance365:'',
                    reward:'',
                    total:'',
                    total90:'',
                    total180:'',
                    total365:'',
                    loading:true,
                })
            })
            state.pledgeList.loading = false
        },
        setHtokenAddress(state, { h , t }){
            let index = state.depositTokenList.findIndex(item=>item.address === t)
            if(index !== -1){
                state.depositTokenList[index].address_h = h
            }
        },
        setDepositBalance(state , info  ){
            let index = state.depositTokenList.findIndex(item=>item.address === info.t)
            if(index !== -1){
                state.depositTokenList[index].decimals = info.decimals
                state.depositTokenList[index].decimals_h = info.decimals_h
                state.depositTokenList[index].balance = info.balance
                state.depositTokenList[index].balance_h = info.balance_h
                state.depositTokenList[index].total = info.total
                state.depositTokenList[index].depositYear = info.depositYear
                state.depositTokenList[index].totalDebt = info.totalDebt
                state.depositTokenList[index].pledgeYear = {...info.pledgeYear}
                state.depositTokenList[index].balanceLoading = false
            }
            console.log("setDepositBalance>>>>>>>>>>>",state.depositTokenList)
        },
        setPledgeBalance(state , info  ){
            if(!info.kind || !state.pledgeList[info.kind]) return 
            let index = state.pledgeList[info.kind].findIndex(item=>item.address === info.t)
            if(index !== -1 ){
                state.pledgeList[info.kind][index].decimals = info.decimals
                state.pledgeList[info.kind][index].decimals_h = info.decimals_h
                state.pledgeList[info.kind][index].balance = info.balance
                state.pledgeList[info.kind][index].balance_h = info.balance_h
                state.pledgeList[info.kind][index].total = info.total
                state.pledgeList[info.kind][index].reward = info.reward
                if(info.kind === 'demand'){
                    // state.pledgeList[info.kind][index].balance90 = info.balance90
                    // state.pledgeList[info.kind][index].Balance180 = info.Balance180
                    // state.pledgeList[info.kind][index].Balance365 = info.Balance365
                    state.pledgeList[info.kind][index].total90 = info.total90
                    state.pledgeList[info.kind][index].total180 = info.total180
                    state.pledgeList[info.kind][index].total365 = info.total365
                    state.pledgeList[info.kind][index].YearPer90 = info.YearPer90
                    state.pledgeList[info.kind][index].YearPer180 = info.YearPer180
                    state.pledgeList[info.kind][index].YearPer365 = info.YearPer365
                }else {
                    state.pledgeList[info.kind][index].YearPer = info.YearPer
                }
                state.pledgeList[info.kind][index].loading = false
            }
        },
        setTotalMintBalance(state , info ){
            let index = state.totalMint.list.findIndex(item=>item.id === info.t)
            if(index !== -1){
                state.totalMint.list[index].decimals0 = info.decimals0
                state.totalMint.list[index].decimals1 = info.decimals1
                state.totalMint.list[index].BankBalance0 = info.BankBalance0
                state.totalMint.list[index].BankBalance1 = info.BankBalance1
                // state.totalMint.list[index].loading = false
            }
        },
        setTotalMintItemLoading(state , info ){
            let index = state.totalMint.list.findIndex(item=>item.id === info.t)
            if(index !== -1){
                state.totalMint.list[index].loading = info.val
            }
        },
        setUserPositionBalance(state , info ){
            let index = state.userPosition.list.findIndex(item=>item.posId === info.t)
            if(index !== -1){
                state.userPosition.list[index].decimals0 = info.decimals0
                state.userPosition.list[index].decimals1 = info.decimals1
                state.userPosition.list[index].H2OReward = info.H2OReward
                state.userPosition.list[index].BNBReward = info.BNBReward
                // state.userPosition.list[index].amount.userToken0 = info.amount.userToken0
                // state.userPosition.list[index].amount.userToken1 = info.amount.userToken1
                // state.userPosition.list[index].amount.debtToken = info.amount.debtToken
                // state.userPosition.list[index].amount.tradeAmount = info.amount.tradeAmount
                // state.userPosition.list[index].amount.token2TokenPrice = info.amount.token2TokenPrice
                // state.userPosition.list[index].amount.token0Total = info.amount.token0Total
                // state.userPosition.list[index].amount.token1Total = info.amount.token1Total
                // state.userPosition.list[index].amount.H2OYear = info.amount.H2OYear
                // state.userPosition.list[index].amount.H2OYear = info.amount.H2OYear

                state.userPosition.list[index].amount = {...info.amount}


                
                state.userPosition.list[index].loading = false
            }
        },
        setAllTokenName(state , {name , name_h , t} ){
            console.log('setAllTokenName>>>>>>>>>>>>>>>>>>>>',t);
            let index = state.depositTokenList.findIndex(item=>item.address === t)
            if(index !== -1){
                state.depositTokenList[index].name = name
                state.depositTokenList[index].name_h = name_h
            }
        },
        setPledgeAllTokenName(state , {name , name_h , t , kind} ){
            if(!kind || !state.pledgeList[kind]) return 
            let index = state.pledgeList[kind].findIndex(item=>item.address === t)
            if(index !== -1){
                state.pledgeList[kind][index].name = name
                state.pledgeList[kind][index].name_h = name_h
            }
        },
        setTotalMintAllTokenName(state , {name , name_h , t}){
            let index = state.totalMint.list.findIndex(item=>item.id === t)
            if(index !== -1){
                state.totalMint.list[index].name0 = name
                state.totalMint.list[index].name1 = name_h
                state.totalMint.list[index].curr = name
            }
        },
        setUserPositionTokenName(state , {name , name_h , t}){
            let index = state.userPosition.list.findIndex(item=>item.posId === t)
            if(index !== -1){
                state.userPosition.list[index].name0 = name
                state.userPosition.list[index].name1 = name_h
                state.userPosition.list[index].curr = name_h
            }
        },
        setDepositCurrent(state , val){
            state.depositCurrentAddress = val
        },


        changeDepositLoadingState(state , {address , bool}){
            let index = state.depositTokenList.findIndex(item=>{
                return item.address_h === address || item.address === address
            })
            if(index !== -1 ){
                state.depositTokenList[index].balanceLoading = bool
            }
        },
        setTotalMintList(state,val){
            val.forEach(item=>{
                state.totalMint.list.push(item)
            })
            // state.totalMint.loading = false
        },
        resetTotalMintList(state){
            state.totalMint.list = []
        },
        setTotalMintItemMultiple(state , {id , type}){
            let index = state.totalMint.list.findIndex(item=>item.id === id)
            
            if(index !== -1){
                let num = state.totalMint.list[index].multiple
                let max = Number(state.totalMint.list[index].max)
                if(type ===1){
                    num < max &&  state.totalMint.list[index].multiple ++
                }
                if(type ===2){
                    num > 1 && state.totalMint.list[index].multiple --
                }
            }
        },
        setUserPositionList(state,val){
            val.forEach(item=>{
                state.userPosition.list.push(item)
            })
            state.userPosition.loading = false
        },
        setTotalMintLoading(state,val){
            state.totalMint.loading = val
        },
        togglePositionState(state,{ posId, point , val }){
            let index = state.userPosition.list.findIndex(item=>item.posId === posId)
            if(index!==-1){
                state.userPosition.list[index][point] = val
            }
        },
        setTotalMintCurr(state , {id , name}){
            let index = state.totalMint.list.findIndex(item=>item.id === id)
            if(index !== -1){
                state.totalMint.list[index].curr = name
            }
        },
        setUserPositionCurr(state , {posId , name}){
            let index = state.userPosition.list.findIndex(item=>item.posId === posId)
            if(index !== -1){
                state.userPosition.list[index].curr = name
            }
        }
    },
    getters:{
        pendingOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 0)
            return filter.length
        },
        successOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 1)
            return filter.length
        },
        failedOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 2)
            return filter.length
        },
        MDEXMintingList:state=>{
            return state.totalMint.list.filter(item=>item.type === 'MDEX')
        },
        PSMintingList:state=>{
            return state.totalMint.list.filter(item=>item.type === 'PS')
        },
        MDEXPositionList:state=>{
            return state.userPosition.list.filter(item=>item.type === 'MDEX')
        },
        PSPositionList:state=>{
            return state.userPosition.list.filter(item=>item.type === 'PS')
        }
    },
    actions:{
        async disconnectMetaMask({commit}){
            commit('disconnect')
        },
        async getInviteList({commit}){
            let res = await getOneLevelLists()
            commit('setInviteList'  ,res)
        },
        async getAirdropValue({commit}){
            let res = await getAirdropValue()
            commit('getAirdropBalance'  ,res)
        },
        async getTokenDecimals({commit}){
            let res = await getDecimals()
            if(res){
                commit('setTokenDecimals' , res)
            }
        },
        async getAirDropDrawed({commit}){
            let res = await getAirDropDrawed()
            commit('setAirDropDrawed' , res)
        },
        createOrderForm({commit } , info){
            commit('createOrder' , info)
        },
        changeTradeStatus({commit} , status){
            commit('change_TradeStatus' , status)
        },

        
        async DepositTokenList({commit ,state}){

            if(state.depositListLoading) return 
            commit("setDepositListLoading" , true)
            let list  = await getDepositTokenList()
            if(Array.isArray(list) && list.length) {
                console.log("getDepositTokenList>>>>>>>>>>>>>>>>>",list)
                commit('setTokenList' , list)
                list.forEach(item=>{
                    getHTokenAddress(item).then(async  res=>{
                        commit('setHtokenAddress' ,{h:res , t:item} )
                        // 获取name
                        let NameInfo = await getAllTokenName(item , res)
                        NameInfo.t = item
                        commit('setAllTokenName' , NameInfo )

                        //  获取decimals balance
                        let info = await getTokenHtokenBalance(item , res)
                        info.t = item
                        commit('setDepositBalance' ,info  )
                        console.log('info' , info);
                    })
                })
                commit("setDepositListLoading" , false)

            }
        },
        async refreshListBalance({commit , state} , tokenAddress){
            commit('changeDepositLoadingState' , {tokenAddress , bool:true})
            let index = state.depositTokenList.findIndex(item=>{
                return item.address_h === tokenAddress || item.address === tokenAddress
            })
            console.log('更新balance', index);
            if(index !== -1){
                const { address , address_h , decimals , decimals_h } = state.depositTokenList[index]
                
                let info = await getTokenHtokenBalance(address , address_h)
                info.t = address
                commit('setDepositBalance' , info)
            }
            commit('setDepositCurrent' , null)
        },

        async pledgeTokenList({commit , state} ,){
            if(state.pledgeList.loading) return 
            commit("setPledgeListLoading" , true)
            const {fixed ,demand  } = pledgeList
            commit('setPledgeList' ,{fixed , demand} )
            if(fixed.length){
                let fixedList = [...fixed]
                fixedList.forEach(async item=>{
                    let NameInfo = await getAllTokenName(item.originToken , item.token )
                    NameInfo.t = item.originToken
                    NameInfo.kind = 'fixed'
                    commit('setPledgeAllTokenName' , NameInfo )
                    let info = await getPledgeTokensBalance(item.originToken , item.token , item.pId , 'fixed')
                    info.t = item.originToken
                    info.kind = 'fixed'
                    commit('setPledgeBalance' ,info)
                })
            }
            if(demand.length){
                let demandList = [...demand]
                demandList.forEach(async item=>{
                    let NameInfo = await getAllTokenName(item.originToken , item.token )
                    NameInfo.t = item.originToken
                    NameInfo.kind = 'demand'
                    commit('setPledgeAllTokenName' , NameInfo )
                    const { D90 , D180 , D365 } = item
                    let info = await getPledgeTokensBalance(item.originToken , item.token , {D90,D180,D365 } , 'demand')
                    info.t = item.originToken
                    info.kind = 'demand'
                    commit('setPledgeBalance' ,info)
                })
            }
            console.log('state.pledgeList' , state.pledgeList);
        },
        async getRTokenBalance({commit , state}){
            commit('setIsNeedRefreshIRO' , true)
            let balance  = await getBalance(state.IRO.address , state.IRO.decimals , state.fairLaunchAddress)
            let reward = await getRewardBalance(pledgeList.IROPid)
            console.log('IRO余额',balance);
            console.log('reward余额',reward);
            console.log('pledgeList.IROPid',pledgeList.IROPid);
            commit('setIRObalance' , {balance , reward})
        },
        judgeDepositCurrentIsIRO({commit , state , dispatch} , address){
            if(address === state.IRO.address){
                dispatch('getRTokenBalance')
            }else {
                // commit('setDepositCurrent' , address)
                dispatch('pledgeTokenList')
            }
        },


        async getMintListInfo({commit , state , dispatch}){
            if(state.totalMint.loading)return
            commit('setTotalMintLoading' , true)
            // let tokenList = await getUserPositionList()
            commit('resetTotalMintList')
            let AllPosition = await getAllTokenPosition()
            let list = tokenList.tokenList.map(item=>{
                return {
                    ...item,
                    name0:'',
                    name1:'',
                    decimals0:18,
                    decimals1:18,
                    BankBalance0:0,
                    BankBalance1:0,
                    multiple:1,
                    loading:true,
                    curr:''
                }
            })
            let InfoData=[
                {
                    year:'9.11%',
                    oldyear:'2.43%',
                    MDXYear:'3.26%',
                    H2OYear:'6.32%',
                    borrYear:'-2.55%',
                    total:'7.03%',
                    daily:'0.01%',
                    allMintNum:'$ 15200.57'
                },
                {
                    year:'6.52%',
                    oldyear:'1.25%',
                    MDXYear:'2.83%',
                    H2OYear:'5.37%',
                    borrYear:'-2.08%',
                    total:'6.12%',
                    daily:'0.01%',
                    allMintNum:'$ 9642.64'
                }
            ]
            await list.forEach(async (item,index)=>{
                if(index === 0){
                    item.info = {...InfoData[0]}
                }else {
                    item.info = {...InfoData[1]}
                }

                let totalAmount = 0
                for (let i=0;i<AllPosition.length ;i++){
                    if(AllPosition[i].goblin === item.goblin){
                        totalAmount += Number(fromWei(AllPosition[i].totalValue , item.decimals1))
                        totalAmount += Number(fromWei(AllPosition[i].positionsValue , item.decimals1))
                    }
                }

                // let token2TokenPrice = await getToken2TokenPrice( usdt , AllPosition[i].borrowToken)
                let token2TokenPrice = 1
                item.info.allMintNum = totalAmount*token2TokenPrice

                let H2OYear = await H2OYearIncomeFarm(item.pId ,tokenList.H2O )
                item.info.H2OYear = H2OYear*100

                let minMax = await getMintMaxAndMin(item.pId)
                item.MAX = fromWei(minMax.maxDebt , 18)
                item.MIN = fromWei(minMax.minDebt , 18)
                let total = await getDepositTotal(item.token0)
                let Debt = await getDepositTotalDebt(item.token0 , total)
                item.depositYear0 = Debt.totalDebt ==='0' ? 0: Number(Debt.ratePerSec) * (Number(total)/Number(Debt.totalDebt))*0.8*100

                let total1 = await getDepositTotal(item.token1)
                let Debt1 = await getDepositTotalDebt(item.token1 , total1)
                item.depositYear1 = Debt1.totalDebt ==='0' ? 0: Number(Debt1.ratePerSec) * (Number(total1)/Number(Debt1.totalDebt))*0.8*100


                item.info.MDXYear = '0.3504'

                let tradeFee = await getYearRateFee(item.goblin , item.type)
                item.info.tradeFee = Number(tradeFee) / 100
                commit('setTotalMintItemLoading' , { t:item.id  , val:false})
                
            })

            commit('setTotalMintList' ,list)
            list.forEach( async (item,index)=>{
                let NameInfo = await getAllTokenName(item.token0 , item.token1)
                NameInfo.t = item.id,
                commit('setTotalMintAllTokenName' , NameInfo )
                let decimals0 = await getTokenDecimals(item.token0)
                let decimals1 = await getTokenDecimals(item.token1)
                let BankBalance0 = 0
                let BankBalance1 = await getBalance(item.token1 , decimals1 , state.bankAddress)
                console.log('bank余额' , BankBalance1);
                let decimalsInfo ={
                    decimals0,
                    decimals1,
                    BankBalance0,
                    BankBalance1,
                    t : item.id
                }
                commit('setTotalMintBalance' ,decimalsInfo  )
            })
        },
        async getUserPosition({commit , state }){
            if(state.userPosition.loading)return
            commit('setUserPositionLoading' , true)
            commit('reseUserPosition')
            let tokens = await getUserPositionList()
            let list = tokens.map(item=>{
                let PSgoblin = tokenList.tokenList.findIndex(ele=>ele.goblin === item.goblin)
                // let type = PSgoblin === -1 ? 'PS' : tokenList.tokenList[PSgoblin].type
                let type = 'PS'
                let Withdraw = ''
                let strategyAdd = ''
                let pId = '0'
                console.log('PSgoblin',PSgoblin);
                if(PSgoblin !== -1 ){
                    type = tokenList.tokenList[PSgoblin].type
                    Withdraw = tokenList.tokenList[PSgoblin].Withdraw
                    strategyAdd = tokenList.tokenList[PSgoblin].strategyAdd
                    pId = tokenList.tokenList[PSgoblin].pId
                }
                return {
                    token0:item.token0,
                    token1:item.token1,
                    posId:item.posid,
                    goblin:item.goblin,
                    positionsValue:item.positionsValue,
                    totalValue:item.totalValue,
                    name0:'',
                    name1:'',
                    Withdraw,
                    strategyAdd,
                    type,
                    pId,
                    decimals0:18,
                    decimals1:18,
                    borrowToken:item.borrowToken,
                    H2OReward:0,
                    BNBReward:0,
                    loading:true,
                    BNBLoading:false,
                    H2OLoading:false,
                    amount:{
                        userToken0:0,
                        userToken1:0,
                        debtToken:0,
                        tradeAmount:0,
                        token2TokenPrice:1,
                        token0Total:0,
                        token1Total:0,
                        MDXYear:0,
                        H2OYear:0,
                        tradeFee:0,
                        depositYear0:0,
                        depositYear1:0,

                        // AllValueToken1:0
                    },
                    curr:''
                }
            })
            list = list.filter(item=>item.positionsValue!=='0')
            commit('setUserPositionList' ,list)
            list.forEach( async item=>{
                console.log()
                let NameInfo = await getAllTokenName(item.token0 , item.token1)
                NameInfo.t = item.posId
                commit('setUserPositionTokenName' , NameInfo )
                let positionsinfo = await getPosition(item.posId)
                console.log('positionsinfo',positionsinfo);
                let decimals0 = await getTokenDecimals(item.token0)
                let decimals1 = await getTokenDecimals(item.token1)
                // let H2OReward = await getPositionRewardBalance(item.pId , decimals1 , tokenList.PSGoblin)
                let H2OReward = await getPositionRewardBalance(item.pId , 18 )
                let BNBReward = await getPositionRewardBalanceBNB(tokenList.MDEXGoblin , 18)
                let decimalsInfo ={
                    decimals0,
                    decimals1,
                    t:item.posId,
                    H2OReward,
                    BNBReward
                }
                
                let isBorrowToken1 = item.borrowToken === item.token0
                let shares = await getRedeemLiquidityShares(item.goblin , item.posId)
                let liquidity = await getRedeemLiquidity(item.goblin , shares , decimals0)
                let lptoken = await getLptoken(item.goblin)
                let totalSupply = await getLptokenTotalSupply(lptoken , decimals0)
                let balance = await getLptokenReserves(lptoken , decimals0 , decimals1 )
                let token2TokenPrice = await getToken2TokenPrice(item.token0,item.token1 , item.type)
                // let token2TokenPrice = await getToken2TokenPrice(item.token0,item.token1 )
               



                console.log('token2TokenPrice' , token2TokenPrice);
                const { amount0 , amount1 } = balance
                decimalsInfo.amount={
                    userToken1 : amount0*liquidity/totalSupply,
                    userToken0 : amount1*liquidity/totalSupply,
                    debtToken :toolNumber(fromWei(item.totalValue , decimals1)*token2TokenPrice ),
                    token2TokenPrice,
                    token1Total:(amount0*liquidity/totalSupply) + (amount1*liquidity/totalSupply)*token2TokenPrice,
                    token0Total:(amount1*liquidity/totalSupply) + (amount0*liquidity/totalSupply)/token2TokenPrice,
                }
                const { token1Total , token0Total , debtToken , userToken0 , userToken1 } = decimalsInfo.amount
                console.log('debtToken',debtToken);
                console.log('userToken0',userToken0);
                console.log('userToken1',userToken1);
                // decimalsInfo.amount.AllValueToken1 = token1Total + Number(debtToken)
                // decimalsInfo.amount.AllValueToken0 = token0Total + Number(debtToken)
                let tdnum = debtToken/token2TokenPrice - (isBorrowToken1 ? userToken0 :userToken1)
                
                decimalsInfo.amount.tradeAmount = tdnum < 0 ? 0 : tdnum
                console.log('H2OReward' , H2OReward);


                // 年化率展示
                let H2OYear = await H2OYearIncomeFarm(item.pId ,tokenList.H2O )
                decimalsInfo.amount.H2OYear = H2OYear*100

                let total = await getDepositTotal(item.token0)
                let Debt = await getDepositTotalDebt(item.token0 , total)
                decimalsInfo.amount.depositYear0 = Debt.totalDebt ==='0' ? 0: Number(Debt.ratePerSec) * (Number(total)/Number(Debt.totalDebt))*0.8*100

                let total1 = await getDepositTotal(item.token1)
                let Debt1 = await getDepositTotalDebt(item.token1 , total1)
                decimalsInfo.amount.depositYear1 = Debt1.totalDebt ==='0' ? 0: Number(Debt1.ratePerSec) * (Number(total1)/Number(Debt1.totalDebt))*0.8*100
                decimalsInfo.amount.MDXYear = '0.3504'

                let tradeFee = await getYearRateFee(item.goblin , item.type)
                decimalsInfo.amount.tradeFee = Number(tradeFee) / 100

                commit('setUserPositionBalance' ,decimalsInfo  )
            })
        }

    }
}