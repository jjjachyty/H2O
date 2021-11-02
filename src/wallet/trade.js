
import {  fromWei , toWei } from '@/utils/tools'
import airdropABIs from './abis/airdrop.json'
import { toolNumber } from '@/utils/tools'
import  tokenABI from './abis/token.json'
import  bankABI from './abis/bank.json'
import Address from './address.json'
import fairLaunchABI from './abis/fairLaunch.json'
import tokensInfo from './tokens'
import goblinMDEXABI from './abis/goblinMDEX.json'
import TIMELOCKABI from './abis/timeLock.json'
// 领取空投奖励

export const receiveAirdrop = function (recommand){
    console.log('receiveAirdrop' , recommand);
    const address = __ownInstance__.$store.state.base.address;
    const contractAddress = __ownInstance__.$store.state.base.airdropAddress;
    const contract = new web3.eth.Contract(airdropABIs, contractAddress);
    let encodedABI = contract.methods.draw(recommand).encodeABI();
  
    let timestamp = new Date().getTime().toString()
    __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
    return new Promise((resolve, reject) => {
      let hashInfo
      web3.eth.getTransactionCount(address).then(async transactionNonce => {
        let gasPrice = await web3.eth.getGasPrice();
        let estimateGas = await web3.eth.estimateGas({
          from: address,
          to: contractAddress, // 池地址
          data: encodedABI, // Required
        })
        console.log('estimateGas' ,estimateGas)
        const params = [{
          from: address,
          to: contractAddress, // 池地址
          data: encodedABI, // Required
          gasPrice: web3.utils.toHex(gasPrice), // Optional
          gas: web3.utils.toHex(estimateGas), // Optional
          // gas: web3.utils.toHex(400000), // Optional
        }];
        web3.eth.sendTransaction(params[0])
          .on('transactionHash', function (hash) {
            console.log('hash', hash);
            if (hash) {
              hashInfo = hash
            }
          })
          .on('receipt', function (receipt) {
            // 交易成功
            __ownInstance__.$store.dispatch('getAirdropValue')
            __ownInstance__.$store.dispatch('getAirDropDrawed')
            __ownInstance__.$store.dispatch('changeTradeStatus' , { id:timestamp , val:1 ,  hash:hashInfo})
            resolve(hashInfo)
          })
          .on('confirmation', function (confirmationNumber, receipt) {
          })
          .on('error', function (err) {
            let isUserDeny = err.code === 4001 
            __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
            console.log('err' , err)
            reject(err)
          })
      })
      .catch(err=>{
        console.log('receiveAirdrop_err',err)
        __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
        reject(err)
      })
    })
}

export const receiveAllTokenRewards = function (token){
  const address = __ownInstance__.$store.state.base.address
  const timeLockAddress = __ownInstance__.$store.state.base.timeLockAddress
  const contract = new web3.eth.Contract(TIMELOCKABI, timeLockAddress);
  let encodedABI = contract.methods.withdraw(token).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: timeLockAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: timeLockAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('getAirdropValue')
          __ownInstance__.$store.dispatch('getAirDropDrawed')
          __ownInstance__.$store.dispatch('changeTradeStatus' , { id:timestamp , val:1 ,  hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


// 领取推荐挖矿奖励

export const receiveMintReward = function (){
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.airdropAddress;
  const contract = new web3.eth.Contract(airdropABIs, contractAddress);
  let encodedABI = contract.methods.claim().encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('getAirdropValue')
          __ownInstance__.$store.dispatch('getAirDropDrawed')
          __ownInstance__.$store.dispatch('changeTradeStatus' , { id:timestamp , val:1 ,  hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


// 授权

export const approve =  function (tokenAddress  , otherAddress ,  amount , decimals) {
  const account = __ownInstance__.$store.state.base.address;
  const approveAmount = (amount &&  decimals)? web3.utils.toHex(toWei(amount , decimals))  : web3.utils.toHex(toolNumber(1.157920892373163*Math.pow(10 , 59)))
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const contract = otherAddress || __ownInstance__.$store.state.base.bankAddress
  const approveEncodedABI = tokenContract.methods
    .approve(contract, approveAmount)
    .encodeABI();
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(account).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateParams ={
        from: account,
        to: tokenAddress, // 池地址
        data: approveEncodedABI, // Required
      }
      let estimateGas = await web3.eth.estimateGas(estimateParams)
        const params = [{
          chainId: __ownInstance__.$store.state.base.chainId,
          nonce: web3.utils.toHex(transactionNonce),
          // gasLimit: web3.utils.toHex(6000000),
          gasLimit: web3.utils.toHex(estimateGas),
          gasPrice: web3.utils.toHex(gasPrice),
          to: tokenAddress,
          from: account,
          data: approveEncodedABI
        }];
        web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
      
    });
  })
}


// 存款存入

export const depositPutIn = function (tokenAddress ,decimals ,  amount){
  console.log('depositPutIn' , amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  let isCoinbase = tokenAddress === '0x0000000000000000000000000000000000000000'
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  const value = isCoinbase? '0x0' :  web3.utils.toHex(depositAmount)
  let encodedABI = contract.methods.deposit(tokenAddress  , value).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateParams ={
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      }
      if(isCoinbase) estimateParams.value = web3.utils.toHex(depositAmount) 
      let estimateGas = await web3.eth.estimateGas(estimateParams)
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(2000000), // Optional
      }];
      if(isCoinbase) params[0].value =  web3.utils.toHex(depositAmount) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


// 提取
export const depositPutOut = function (tokenAddress ,decimals ,  amount){
  console.log('depositPutOut' , amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  let encodedABI = contract.methods.withdraw(tokenAddress  , web3.utils.toHex(depositAmount)).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}



// 质押

export const pledgePutIn = function (tokenAddress ,decimals ,  amount , type){
  console.log('pledgePutIn' , type);
  console.log('pledgePutInAmount' , amount);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  const pledgeAmount = toWei(amount, decimals)
  // let encodedABI = contract.methods.deposit(tokenAddress  , type , web3.utils.toHex(pledgeAmount)).encodeABI();
  let encodedABI = contract.methods.deposit(address  , type , web3.utils.toHex(pledgeAmount)).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Opt/ional
        // gas: web3.utils.toHex(1000000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}



// 解押

export const pledgePutOut = function (tokenAddress ,decimals ,  amount , type){
  console.log('pledgePutOut' , type);
  console.log('pledgePutAmount' , amount);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  const pledgeAmount = toWei(amount, decimals)
  // let encodedABI = contract.methods.withdraw(tokenAddress  , type  , web3.utils.toHex(pledgeAmount)).encodeABI();
  let encodedABI = contract.methods.withdraw(address  , type  , web3.utils.toHex(pledgeAmount)).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(800000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


// IRO领取奖励

export const getIROReward = function (type){
  console.log('getIROReward' , type);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let encodedABI = contract.methods.harvest(type).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(800000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('getIROReward_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}





// 杠杆挖矿

/**
 * 
 * @param {借款token} borrowToken 
 * @param {非借款token} otherToken 
 * @param {借款token转账金额} borrowTokenAmount 
 * @param {*} otherTokenAmount 
 * @param {*} borrowTokenDecimals 
 * @param {*} otherTokenDecimals 
 * @param {借款金额} borrowAmount 
 * @param {*} posId 
 * @param {*} pid 
 * @returns 
 */


export const mintWork = function (borrowToken ,otherToken ,borrowTokenAmount ,  otherTokenAmount , borrowTokenDecimals , otherTokenDecimals , borrowAmount , posId , pid  , strategyAddress){
  console.log('borrowTokenAmount' , borrowTokenAmount);
  console.log('otherTokenAmount' , otherTokenAmount);
  // console.log('借款金额' , borrowAmount);
  // console.log('转账金额' , otherTokenAmount);
  const address = __ownInstance__.$store.state.base.address;
  
  let borrowTokenWei = toWei(borrowTokenAmount ,borrowTokenDecimals )
  let otherTokenWei = toWei(otherTokenAmount ,otherTokenDecimals )
  let borrowWei = toWei(borrowAmount ,borrowTokenDecimals )

  // let a = web3.eth.abi.encodeParameters(['address', 'address', 'uint256', 'uint256', 'uint256'], [token1, '0x0000000000000000000000000000000000000000', 0,  amount0Wei, 0]);
  let a = web3.eth.abi.encodeParameters(['address', 'address', 'uint256', 'uint256', 'uint256'], [borrowToken, otherToken, borrowTokenWei,  otherTokenWei, 0]);
  let b = strategyAddress
  let c = web3.eth.abi.encodeParameters(['address', 'bytes'], [b, a])
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);

  let amount = web3.utils.toHex(borrowWei)
  let encodedABI = contract.methods.work(  posId , pid  , amount, c).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateParams ={
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      }
      estimateParams.value = web3.utils.toHex(otherTokenWei) 
      let estimateGas = await web3.eth.estimateGas(estimateParams)
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(2000000), // Optional
      }];
      params[0].value =  web3.utils.toHex(otherTokenWei) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          __ownInstance__.$store.commit('setPositionFinish',true)
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}




/// 赎回 仓位


export const RedeemWork = function (borrowToken ,otherToken ,type , posId ,withDraw ){
  console.log('borrowToken' , borrowToken);
  console.log('otherToken' , otherToken);
  console.log('type' , type);
  console.log('posId' , posId);
  console.log('withDraw' , withDraw);
  const address = __ownInstance__.$store.state.base.address;
 
  
  let a = web3.eth.abi.encodeParameters(['address', 'address', 'uint', ], [borrowToken, otherToken, type]);
  let b = withDraw
  let c = web3.eth.abi.encodeParameters(['address', 'bytes'], [b, a])
  const contractAddress = __ownInstance__.$store.state.base.bankAddress;
  const contract = new web3.eth.Contract(bankABI, contractAddress);

  let encodedABI = contract.methods.work(posId , 0  , 0 , c).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateParams ={
      //   from: address,
      //   to: contractAddress, // 池地址
      //   data: encodedABI, // Required
      // }
      // let estimateGas = await web3.eth.estimateGas(estimateParams)
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        // gas: web3.utils.toHex(estimateGas), // Optional
        gas: web3.utils.toHex(2000000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          __ownInstance__.$store.commit('setPositionFinish',true)
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
          __ownInstance__.$store.commit('setPositionFinish',true)

        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      __ownInstance__.$store.commit('setPositionFinish',true)

      reject(err)
    })
  })
}

// 获取positionH2O奖励

export const getPositionRewardH2O = function (pId){
  console.log('getPositionReward' , pId);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.fairLaunchAddress;
  const contract = new web3.eth.Contract(fairLaunchABI, contractAddress);
  let encodedABI = contract.methods.harvest(pId).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateGas = await web3.eth.estimateGas({
      //   from: address,
      //   to: contractAddress, // 池地址
      //   data: encodedABI, // Required
      // })
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        // gas: web3.utils.toHex(estimateGas), // Optional
        gas: web3.utils.toHex(800000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('getPositionRewardH2O',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

export const getPositionRewardBNB= function (){
  console.log('getPositionRewardBNB' );
  const address = __ownInstance__.$store.state.base.address;
  const contract = new web3.eth.Contract(goblinMDEXABI, tokensInfo.MDEXGoblin);
  let encodedABI = contract.methods.harvest().encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateGas = await web3.eth.estimateGas({
      //   from: address,
      //   to: tokensInfo.MDEXGoblin, // 池地址
      //   data: encodedABI, // Required
      // })
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: tokensInfo.MDEXGoblin, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        // gas: web3.utils.toHex(estimateGas), // Optional
        gas: web3.utils.toHex(800000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('getPositionRewardH2O',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}
