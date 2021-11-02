
import { fromWei, toWei, toolNumber } from '@/utils/tools'
import airdropABIs from './abis/airdrop.json'
import tokenABI from './abis/token.json'
import bankABI from './abis/bank.json'
import fairLaunchABI from './abis/fairLaunch.json'
import Address from './address.json'
import cakeRouterABI from './abis/cakeRouter.json'
import goblinABI from './abis/goblinPS.json'
import goblinMDEXABI from './abis/goblinMDEX.json'
import LptokenABI from './abis/iptoken.json'
import configABI from './abis/config.json'
import PLEDGE from './pledge'
import TOKENS from './tokens'
import TIMELOCKABI from './abis/timeLock.json'
// export async function airdrop_add_whitelist (user , recommand){
//     if(!user || !recommand) return 
//     const address = __ownInstance__.$store.state.base.airdropAddress
//     const contract = new web3.eth.Contract(airdropABIs , address)
//     let res = false
//     console.log('user' ,user);
//     console.log('recommand' ,recommand);
//     await contract.methods.addWhiteList( user , recommand ).call(function (error, result) {
//       if (!error) {
//         console.log('addWhiteList' ,result);
//         res = result
//       }else   {
//         console.log('addWhiteList_err',error)
//       }
//     });
//     return res;
// }
// 质押获取详细奖励
export async function getPledgeRewardInfo() {
  const address = __ownInstance__.$store.state.base.address
  const timeLockAddress = __ownInstance__.$store.state.base.timeLockAddress
  const contract = new web3.eth.Contract(TIMELOCKABI, timeLockAddress)
  let result
  await contract.methods.VestingAmount(address).call(function (err, res) {
    if (!err) {
      result = fromWei(res, 18)
    } else {
      console.log('getPledgeRewardInfo_err', err)
    }
  })
  return result
}

export async function getPledgeRewardInfo1() {
  const address = __ownInstance__.$store.state.base.address
  const timeLockAddress = __ownInstance__.$store.state.base.timeLockAddress
  const contract = new web3.eth.Contract(TIMELOCKABI, timeLockAddress)
  let result
  await contract.methods.CanWithdrawAmount(address).call(function (err, res) {
    if (!err) {
      result = fromWei(res, 18)
    } else {
      console.log('getPledgeRewardInfo1_err', err)
    }
  })
  return result
}


export async function getPledgeRewardUnlock() {
  const address = __ownInstance__.$store.state.base.address
  const timeLockAddress = __ownInstance__.$store.state.base.timeLockAddress
  const contract = new web3.eth.Contract(TIMELOCKABI, timeLockAddress)
  let result
  await contract.methods.WaitingAmount(address).call(function (err, res) {
    if (!err) {
      result = fromWei(res, 18)
    } else {
      console.log('getPledgeRewardInfo1_err', err)
    }
  })
  return result
}



//  邀请详情 一级代理
export async function getOneLevelLists() {
  __ownInstance__.$store.commit('setInviteListLoading', true)
  const address = __ownInstance__.$store.state.base.address
  const airdropAddress = __ownInstance__.$store.state.base.airdropAddress
  const contract = new web3.eth.Contract(airdropABIs, airdropAddress)
  let result
  await contract.methods.getOneLevelLists(address).call(function (err, res) {
    if (!err) {
      result = res
    } else {
      console.log('getOneLevelLists_err', err)
    }
  })
  return result
}


// 获取空投挖矿奖励

export async function getAirdropMintReward() {
  const address = __ownInstance__.$store.state.base.address
  const airdropAddress = __ownInstance__.$store.state.base.airdropAddress
  const contract = new web3.eth.Contract(airdropABIs, airdropAddress)
  let result
  await contract.methods.recommendReward(address).call(function (err, res) {
    if (!err) {
      result = res
    } else {
      console.log('getAirdropMintReward_err', err)
    }
  })
  return result
}



// 空投奖励余额
export async function getAirdropValue() {
  const address = __ownInstance__.$store.state.base.address
  const decimals = __ownInstance__.$store.state.base.tokenDecimals
  const airdropAddress = __ownInstance__.$store.state.base.airdropAddress
  const contract = new web3.eth.Contract(airdropABIs, airdropAddress)
  let result
  await contract.methods.airDropValue(address).call(function (err, res) {
    if (!err) {
      result = fromWei(res, decimals)
    } else {
      console.log('getOneLevelLists_err', err)
    }
  })
  return result
}

// 获取Decimals
export async function getDecimals() {
  const airdropAddress = __ownInstance__.$store.state.base.airdropAddress
  const contract = new web3.eth.Contract(airdropABIs, airdropAddress)
  let result
  await contract.methods.tokenDecimals().call(function (err, res) {
    if (!err) {
      console.log('Decimals', res);
      result = res
    } else {
      console.log('getOneLevelLists_err', err)
    }
  })
  return result
}

// 已领取空投奖励
export async function getAirDropDrawed() {
  const address = __ownInstance__.$store.state.base.address
  const decimals = __ownInstance__.$store.state.base.tokenDecimals
  const airdropAddress = __ownInstance__.$store.state.base.airdropAddress
  const contract = new web3.eth.Contract(airdropABIs, airdropAddress)
  let result
  await contract.methods.airDropDrawed(address).call(function (err, res) {
    if (!err) {
      result = fromWei(res, decimals)
    } else {
      console.log('getOneLevelLists_err', err)
    }
  })
  return result
}

// 获取余额
export async function getBalance(tokenAddress, decimals, poolAddress) {
  const address = poolAddress || __ownInstance__.$store.state.base.address
  let balance = 0;
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    balance = await new web3.eth.getBalance(address)
    return fromWei(balance, decimals)
  }


  const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  await contract.methods.balanceOf(address).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
    } else {
      console.log('balanceErr', error);
    }
  });
  return balance;
}

// 获取Decimals
export async function getTokenDecimals(tokenAddress) {
  if (tokenAddress === '0x0000000000000000000000000000000000000000') return 18
  const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  let decimals = 18;
  await contract.methods.decimals().call(function (error, result) {
    if (!error) {
      decimals = result;
      console.log('decimals', result);
    } else {
      console.log('getTokenDecimals_err', error);
    }
  });
  return decimals;
}

// 是否授权
export const isApproved = async function (tokenAddress, decimals, amount, otherAddress) {
  if (tokenAddress === '0x0000000000000000000000000000000000000000') return true
  const account = __ownInstance__.$store.state.base.address;
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  let contract = otherAddress || __ownInstance__.$store.state.base.bankAddress
  let approveAmount = 0;
  await tokenContract.methods.allowance(account, contract).call(function (error, result) {
    if (error) {
      return false;
    }
    approveAmount = result;
    console.log('检查授权', approveAmount);

  })
  return Number(toWei(amount.toString(), decimals)) < approveAmount;
}



// 获取存款列表addressList
export async function getDepositTokenList() {
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let list = [];
  await contract.methods.getAllToken().call(function (error, result) {
    if (!error) {
      list = result;
      console.log('存款列表', result);
    }
  });
  return list;
}

// 获取存款列表addressList
export async function getMintMaxAndMin(id) {
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let list = [];
  await contract.methods.productions(id).call(function (error, result) {
    if (!error) {
      list = result;
    } else {
      console.log('getMintMaxAndMin', error);
    }
  });
  return list;
}

// 获取token对应Htoken address
export async function getHTokenAddress(tokenAddress) {
  // if(tokenAddress ==='0x5CF8493151B86FF753c3B76450B5F55B52904a75') return '0x2Ae3ddFc9439bDb50B89F323b79D3426A5F83799'
  // if(tokenAddress ==='0x0000000000000000000000000000000000000000') return '0xBA4a613EB695414C9E25CE60af259784F29e1BCA'
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let add = '';
  await contract.methods.iTokens(tokenAddress).call(function (error, result) {
    if (!error) {
      add = result;
      console.log('HtokenAddress', result);
    }
  });
  return add;
}

// 获取token 和htoken的余额
export async function getTokenHtokenBalance(t, h) {
  let bool = t === '0x0000000000000000000000000000000000000000'

  let decimals = bool ? 18 : await getTokenDecimals(t)
  let decimals_h = await getTokenDecimals(h)
  let balance = await getBalance(t, decimals)
  let balance_h = await getBalance(h, decimals_h)
  // console.log('balance',balance);
  // console.log('balance_h',balance_h);
  let total = await getDepositTotal(t)
  let Debt = await getDepositTotalDebt(t, total)
  const { totalDebt, ratePerSec } = Debt
  let depositYear = totalDebt === '0' ? 0 : Number(ratePerSec)*100 //*(Number(total) / Number(totalDebt)) * 0.8 * 100
  console.log('ratePerSec', ratePerSec,"depositYear",);
  // console.log('depositYear' ,depositYear ,ratePerSec , total , totalDebt );
  let pledgeYear = await getPledgeYear(t, total, decimals)
  // console.log('pledgeYear',pledgeYear);


  return {
    decimals,
    decimals_h,
    balance,
    balance_h,
    total: fromWei(total, decimals),
    depositYear: toolNumber(depositYear),
    pledgeYear,
    totalDebt: fromWei(totalDebt, decimals)
    // pledge:pledgeYear.pledge
    // YearPerMin:pledgeYear.YearPerMin,
    // YearPerMax:pledgeYear.YearPerMin
  }
}



async function getPledgeYear(token, total, decimals) {
  console.log('token-----------------', token);
  // let bool = token === '0xcEc714fF47288937fd0F3386F172Bc0CfCF2E50f'
  const { fixed, demand } = PLEDGE
  let pids = []
  let YearPerMin = 0, YearPerMax = 0, YearPer90 = 0, YearPer180 = 0, YearPer365 = 0, YearPerFixed = 0
  //活期
  if (fixed.length) {
    let index = fixed.findIndex(item => item.originToken === token)
    if (index !== -1) {
      let amount = await H2OYearIncome(fixed[index].pId)
      pids.push(amount)
      // let total = await getPoolTotal(fixed[index].pId)
      console.log('后来total', total);
      YearPerFixed = await getDemandYearARP(fixed[index].pId, fromWei(total, 18), token)
    }
  }
  // if(demand.length){
  //   let index = demand.findIndex(item=>item.originToken === token)
  //   if(index !== -1){
  //     let amount = await H2OYearIncome(demand[index].D90)
  //     let amount1 = await H2OYearIncome(demand[index].D180)
  //     let amount2 = await H2OYearIncome(demand[index].D365)
  //     pids.push(amount)
  //     pids.push(amount1)
  //     pids.push(amount2)
  //     let total90 = await getPoolTotal(demand[index].D90)
  //     let total180 = await getPoolTotal(demand[index].D180)
  //     let total365 = await getPoolTotal(demand[index].D365)

  //     // bool && console.log('total90',total90);
  //     // bool && console.log('total180',total180);
  //     // bool && console.log('total365',total365);

  //     YearPer90 = await getDemandYearARP(demand[index].D90 , total90 , token)
  //     YearPer180 = await getDemandYearARP(demand[index].D180 , total180  , token)
  //     YearPer365 = await getDemandYearARP(demand[index].D365 ,  total365 , token )

  //   }
  // }
  // bool && console.log('total--',total);
  // bool && console.log('YearPerFixed',YearPerFixed);
  // bool && console.log('YearPer90',YearPer90);
  // bool && console.log('YearPer180',YearPer180);
  // bool && console.log('YearPer365',YearPer365);


  // YearPerMin = Math.min(YearPer90,YearPer180,YearPer365 , YearPerFixed)
  // YearPerMax = Math.max(YearPer90,YearPer180,YearPer365 , YearPerFixed)
  YearPerMin = YearPerFixed
  YearPerMax = YearPerFixed
  // console.log('YearPerMin',YearPerMin);
  // console.log('YearPerMax',YearPerMax);
  let totalH2OYearIncome = 0
  if (pids.length) {
    pids.forEach(async item => {
      totalH2OYearIncome += Number(item)
    })
  } else {
    return 0
  }
  // console.log('totalH2OYearIncome',totalH2OYearIncome);
  // console.log('total',total);

  // let H2OPrice = 0.001//await getToken2TokenPrice( TOKENS.H2O ,"USDT" )
  // let token2TokenPrice = 500//await getToken2TokenPrice( token ,"USDT" )
  console.log("YearPerMin", YearPerMin, "YearPerMax", YearPerMax)
  return {
    // pledge: totalH2OYearIncome * H2OPrice / (total / Math.pow(10, decimals) * token2TokenPrice) * 100,
    YearPerMin,
    YearPerMax
  }

}

// 获取存款的总存
export async function getDepositTotal(token) {
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let add = '';
  await contract.methods.totalToken(token).call(function (error, result) {
    if (!error) {
      add = result;
    } else {
      console.log('getDepositTotalErr', error);
    }
  });
  return add;
}

// 获取存款的总借
export async function getDepositTotalDebt(token, total) {
  console.log('bank.totalDebt', token);
  let bank = await getAllbanks(token)
  console.log('total', total);
  let ratePerSec = await getInterestRate(bank.totalDebt, total)
  return {
    totalDebt: bank.totalDebt,
    // ratePerSec:fromWei(ratePerSec , 16)
    ratePerSec: Number(ratePerSec) * 365 * 24 * 60 * 60 / Math.pow(10, 18)
  }
}

async function getInterestRate(totalDebt, totalBalance) {
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(configABI, Address.config);
  let add = '';
  await contract.methods.getInterestRate(totalDebt, totalBalance).call(function (error, result) {
    if (!error) {
      add = result;
    } else {
      console.log('getInterestRateERR', err);
    }
  });
  return add;
}

// 获取token和itoken名称
export async function getAllTokenName(t, h) {
  let name = t === '0x0000000000000000000000000000000000000000' ? 'BNB' : await getTokenName(t)
  let name_h = h === '0x0000000000000000000000000000000000000000' ? 'BNB' : await getTokenName(h)
  return {
    name,
    name_h
  }
}

// 获取名称
export async function getTokenName(tokenAddress) {
  const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  let name = '';
  await contract.methods.symbol().call(function (error, result) {
    if (!error) {
      name = result;
      console.log('name', result);
    } else {
      console.log('getTokenName', error);
    }
  });
  return name;
}



export async function getPledgeTokensBalance(t, h, type, kind) {
  let bool = t === '0x0000000000000000000000000000000000000000'

  let decimals = bool ? 18 : await getTokenDecimals(t)
  let decimals_h = await getTokenDecimals(h)
  let balance = await getBalance(t, decimals)
  let balance_h,
    reward,
    total,
    YearPer,
    Balance90,
    Balance180,
    Balance365,
    total90,
    total180,
    total365,
    YearPer90,
    YearPer180,
    YearPer365

  if (kind === 'fixed') {
    let fixedBalance = await getPledgeBalance(type, decimals_h)
    balance_h = fromWei(fixedBalance['0'], 18)
    // reward = fromWei(fixedBalance['1'],18)
    reward = await getRewardBalance(type)
    total = await getPoolTotal(type)
    // total =  await getDepositTotal(t)
    // let H2OYear = await H2OYearIncome(type)
    YearPer = await getDemandYearARP(type, total, t)
    // YearPer = total=='0' ? 0: toolNumber((H2OYear/total)*100)
    // console.log('pid' , type);
    // console.log('total' , total);
    // console.log('H2OYear' , H2OYear);
    // console.log('YearPer' , YearPer);
  } else if (kind === 'demand') {

    const { D90, D180, D365 } = type
    let defaultObj = { '0': 0, '1': 0 }
    Balance90 = D90 ? await getPledgeBalance(D90, decimals_h) : { ...defaultObj }
    Balance180 = D180 ? await getPledgeBalance(D180, decimals_h) : { ...defaultObj }
    Balance365 = D365 ? await getPledgeBalance(D365, decimals_h) : { ...defaultObj }
    let reward90 = await getRewardBalance(D90)
    let reward180 = await getRewardBalance(D180)
    let reward365 = await getRewardBalance(D365)

    balance_h = Number(fromWei(Balance90['0'], 18)) + Number(fromWei(Balance180['0'], 18)) + Number(fromWei(Balance365['0'], 18))
    // reward = Number(fromWei(Balance90['1'],18)) + Number(fromWei(Balance180['1'],18)) + Number(fromWei(Balance365['1'],18))
    reward = Number(reward90) + Number(reward180) + Number(reward365)
    // console.log('total',total);
    total90 = await getPoolTotal(D90)
    total180 = await getPoolTotal(D180)
    total365 = await getPoolTotal(D365)
    total = Number(total90) + Number(total180) + Number(total365)
    YearPer90 = await getDemandYearARP(D90, total90, t)
    YearPer180 = await getDemandYearARP(D180, total180, t)
    YearPer365 = await getDemandYearARP(D365, total365, t)
  }

  let reObj = {
    decimals,
    decimals_h,
    balance,
    balance_h,
    total,
    reward
  }

  if (kind === 'demand') {
    // reObj.balance90 = balance90
    // reObj.Balance180 = Balance180
    // reObj.Balance365 = Balance365
    reObj.total90 = total90
    reObj.total180 = total180
    reObj.total365 = total365
    reObj.YearPer90 = YearPer90
    reObj.YearPer180 = YearPer180
    reObj.YearPer365 = YearPer365
  } else {
    reObj.YearPer = YearPer
  }
  return reObj
}


// 配置价格

async function getDemandYearARP(pId, total, token) {

  //正式环境这样写
  // var priceH2o =  await getToken2TokenPrice(TOKENS.H2O,Address.BUSDT,'MDEX')
  // var pricetoken =  await getToken2TokenPrice( token,Address.BUSDT,'MDEX')
  // 测试的时候
  var priceH2o = 0.001
  var pricetoken = 1
  if (pId == 2) {
    pricetoken = 500
  } else if (pId == 6) {
    pricetoken = 0.001
  } else if (pId == 7) {
    pricetoken = 1
  }


  let H2OYear = await H2OYearIncome(pId)
  console.log('priceH2o', priceH2o);
  console.log('H2OYear', H2OYear);
  console.log('total--', total);
  console.log('H2OYear/total', H2OYear * priceH2o / (Number(total) * Number(pricetoken)) * 100);
  return total == '0' ? 0 : toolNumber(H2OYear * priceH2o / (Number(total) * Number(pricetoken)) * 100)
}
// 获取质押年化收益率
// export async function getPledgeYearARP(type ) {
//   const address = __ownInstance__.$store.state.base.address;
//   const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
//   const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
//   let balance = 0;
//   await contract.methods.userInfo( 7 , address , 0).call(function (error, result) {
//     if (!error) {
//       balance = result;
//     }
//   });
//   return balance;
// }


export async function getPoolTotal(pid) {
  // const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.pidBalance(pid).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, 18);
      console.log('原生total', result);
    } else {
      console.log('getPoolTotalErr', error);
    }
  });
  return balance;
}

// 获取质押不同期余额
export async function getPledgeBalance(type) {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.getBalanceByPid(type, address).call(function (error, result) {
    if (!error) {
      balance = result;
    }
  });
  return balance;
}

// 获取定期可领取余额
export async function getPledgeReceiveable(type, decimals) {
  // const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  // const address = poolAddress || __ownInstance__.$store.state.base.address
  console.log('获取可领取余额type', type);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.withdrawAmount(address, type).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
    } else {
      console.log('withdrawAmount', error);
    }
  });
  return balance;
}

// 获取奖励余额
export async function getRewardBalance(type, decimals = 18) {
  // const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  // const address = poolAddress || __ownInstance__.$store.state.base.address
  console.log('获取奖励余额type', type);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.pendingRabbit(type, address).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
    } else {
      console.log('pendingRabbit', error);
    }
  });
  return balance;
}

// 获取htoken totalSupply 
export async function getHtokenTotal(tokenAddress, decimals) {
  console.log('tokenAddress', tokenAddress);
  const contract = new web3.eth.Contract(tokenABI, tokenAddress);
  let balance = 0;
  await contract.methods.totalSupply().call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
      console.log('htoken总量', balance);
    } else {
      console.log('getHtokenTotalERR', error);
    }
  });
  return balance;
}

// 获取htoken totalToken

export async function getTotalToken(tokenAddress, decimals) {
  console.log('tokenAddress', tokenAddress);
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let balance = 0;
  await contract.methods.totalToken(tokenAddress).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
      console.log('totalToken', balance);
    } else {
      console.log('getTotalTokenERR', error);
    }
  });
  return balance;
}

// 获取杠杆价格
export const getToken2TokenPrice = async function (token0, token1, type) {

  // if(type === 'TEST'){
  //   if(token0 === Address.BUSDT) return 1
  // }

  if (token0 === Address.BUSDT) return 1
  //if(token1 === 'USDT') return 1
  if (token0 === '0x0000000000000000000000000000000000000000') token0 = Address.WBNB
  if (token1 === '0x0000000000000000000000000000000000000000') token1 = Address.WBNB
  console.log('token0', token0);
  console.log('token1', token1);
  const contractAddress = type === 'MDEX' ? Address.MDEXRouter : Address.cakeRouter
  const contract = new web3.eth.Contract(cakeRouterABI, contractAddress);
  let price = 0
  await contract.methods.getAmountsOut(web3.utils.toHex(toWei(1, 18)), [token0, token1]).call(function (error, result) {
    if (!error && Array.isArray(result) && result[1]) {
      price = fromWei(result[1], 18);
    } else {
      console.log('getToken2TokenPrice_err', error)
    }
  })
  return price
}

// userPosition
export const getUserPosition = async function (id = 0) {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let position = 0;
  await contract.methods.userPosition(address, id).call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      position = result
      console.log('totalToken', position);
    }
  });
  return position;
}

// userPosition
export const getPosition = async function (posId) {
  // const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let position = 0;
  await contract.methods.positions(posId).call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      position = result
      console.log('totalToken', position);
    }
  });
  return position;
}

// 获取持仓列表
export const getUserPositionList = async function () {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let position;
  await contract.methods.getUserPosition(address).call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      position = result
      console.log('持仓列表', position);
    }
  });
  return position;
}

// 获取所有币对持仓
export const getAllTokenPosition = async function () {
  // const address = __ownInstance__.$store.state.base.address
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let position;
  await contract.methods.getAllPosition().call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      position = result
      console.log('所有币对持仓', position);
    }
  });
  return position;
}

// 获取shares
export const getRedeemLiquidityShares = async function (contractAddress, posId) {
  console.log('posId', posId);
  const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(goblinABI, contractAddress);
  let shares = 0;
  await contract.methods.shares(posId).call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      shares = result
      console.log('shares', result);
    }
  });
  return shares;
}
// 获取liquidity
export const getRedeemLiquidity = async function (contractAddress, shares, decimals) {
  const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(goblinABI, contractAddress);
  let liquidity = 0;
  await contract.methods.shareToBalance(shares).call(function (error, result) {
    if (!error) {
      liquidity = fromWei(result, decimals);
      // liquidity = result
      console.log('liquidity', liquidity);
    }
  });
  return liquidity;
}

// 获取lptoken

export const getLptoken = async function (contractAddress) {
  // const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(goblinABI, contractAddress);
  let lptoken = 0;
  await contract.methods.lpToken().call(function (error, result) {
    if (!error) {
      lptoken = result
      console.log('lptoken', lptoken);
    }
  });
  return lptoken;
}



// 获取lptokenTotalSupply

export const getLptokenTotalSupply = async function (contractAddress, decimals) {
  // const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(LptokenABI, contractAddress);
  let totalSupply = 0;
  await contract.methods.totalSupply().call(function (error, result) {
    if (!error) {
      totalSupply = fromWei(result, decimals)
      console.log('totalSupply', totalSupply);
    }
  });
  return totalSupply;
}



// 获取lptokenReserves

export const getLptokenReserves = async function (contractAddress, decimals0, decimals1) {
  // const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(LptokenABI, contractAddress);
  let Reserves = 0;
  await contract.methods.getReserves().call(function (error, result) {
    if (!error) {
      const { _reserve0, _reserve1 } = result
      Reserves = {
        amount0: fromWei(_reserve0, decimals0),
        amount1: fromWei(_reserve1, decimals1)
      }
      console.log('Reserves', Reserves);
    }
  });
  return Reserves;
}


// 获取持仓H2O奖励
export async function getPositionRewardBalance(pid, decimals) {
  console.log('持仓H2O奖励pid', pid);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.pendingRabbit(pid, address).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
    } else {
      console.log('pendingRabbit', error);
    }
  });
  return balance;
}

export async function getPositionRewardBalanceBNB(contractAddress, decimals) {
  console.log('contractAddress', contractAddress);
  const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(goblinMDEXABI, contractAddress);
  let balance = 0;
  await contract.methods.earned(address).call(function (error, result) {
    if (!error) {
      balance = fromWei(result, decimals);
    } else {
      console.log('earned', error);
    }
  });
  return balance;
}






// 
export async function getTotalAllocPoint() {
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.totalAllocPoint().call(function (error, result) {
    if (!error) {
      balance = result;
    } else {
      console.log('totalAllocPoint_error', error);
    }
  });
  return balance;
}


export async function getRabbitPerBlock() {
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.rabbitPerBlock().call(function (error, result) {
    if (!error) {
      balance = result;
    } else {
      console.log('rabbitPerBlock_error', error);
    }
  });
  return balance;
}



export async function getPoolInfo(pId) {
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let balance = 0;
  await contract.methods.poolInfo(pId).call(function (error, result) {
    if (!error) {
      balance = result;
    } else {
      console.log('poolInfo_error', error);
    }
  });
  return balance;
}


export const getAllbanks = async function (address) {
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  let position;
  await contract.methods.banks(address).call(function (error, result) {
    if (!error) {
      // position = fromWei(result, decimals);
      position = result
    }
  });
  return position;
}

export async function H2OYearIncome(pId) {
  let totalAllocPoint = await getTotalAllocPoint()
  let rabbitPerBlock = await getRabbitPerBlock()
  let allocPoint = await getPoolInfo(pId)
  let H2OPutOutYear
  if (totalAllocPoint == '0') {
    H2OPutOutYear = 0
  } else {
    H2OPutOutYear = (allocPoint.allocPoint || 0) / totalAllocPoint * Number(fromWei(rabbitPerBlock, 18))
  }
  H2OPutOutYear = H2OPutOutYear * 10512000
  return H2OPutOutYear
}



export async function H2OYearIncomeFarm(pId, address) {
  let H2OPutOutYear = await H2OYearIncome(pId)
  let total = await getAllbanks(address)
  let totalVal = fromWei(total.totalVal, 18)
  let token2TokenPrice = await getToken2TokenPrice(address, "USDT")

  return totalVal == '0' ? 0 : H2OPutOutYear * token2TokenPrice / Number(totalVal)
}

// 获取交易费率
export const getYearRateFee = async function (contractAddress, type) {
  // const address = __ownInstance__.$store.state.base.address;
  let ABI = type === 'PS' ? goblinABI : goblinMDEXABI
  const contract = new web3.eth.Contract(ABI, contractAddress);
  let feeBps = 0;
  await contract.methods.feeBps().call(function (error, result) {
    if (!error) {
      feeBps = result
      console.log('feeBps', feeBps);
    }
  });
  return feeBps;
}

