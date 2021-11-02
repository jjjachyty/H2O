### 合约方法
已经领取 airDropDrawed
待领取 airDropValue


conf deployed to: 0xdA039c3d3F3e114b7dC3b0A7F469b9EB02341f34
interestModel deployed to: 0x3F27681ac5454ac8DaFBa20d0c3150Eb3C1d844B
bank deployed to: 0x2147fc21926B73A5ea01D521aFd30ddD9b2736E8
H2O deployed to: 0x6C1bC576B227E4b04C53a78cdEe8a7987F47f8B9

存
function deposit(address token, uint256 amount) external payable nonReentrant {
取
function withdraw(address token, uint256 pAmount) external nonReentrant {


合约参考
https://testnet.hecoinfo.com/address/0xD57430aCb085898E3385dCb71DA175418aA40194#code

account0: 0x2287374e8d7090214628adad44Ff1ab56b9284D1
conf deployed to: 0x9936C5ebdD8A87f11D32690cC30A1Df6ee3AF1e8
oracle deployed to: 0xd5C78E7f5d4d586d139444b99c6d460c80012292
interestModel deployed to: 0x6920715c938cb07f41088E4672A1b20b05d993ED
bank_proxy deployed to: 0x29921F72822A235Fe760aF4B40F948D5031d9840
H2O deployed to: 0xcEc714fF47288937fd0F3386F172Bc0CfCF2E50f
addBank end
FairLaunch deployed to: 0x0cB475969513333a60Ee0117866414b40251ad11
AirDrop deployed to: 0xd6aD3B772408A1d3AaA3831C2B074Dbf5c117169
TimeLock deployed to: 0xfb22c6D2eCB6D2411870BD7877122916C3073001
rH2o deployed to: 0x498ac7f836415A3AB06024D2BaD5f9cC4fD346ef
DebtToken deployed to: 0xbaae860c8a36D873f2C162cb0b27A5D5b4E010B5
wbnb deployed to: 0x06C0ece7D7E5BB8a4A1d8D8B206c971CEB7ac0C6
PancakeFactory deployed to: 0xEDaE78D6B993Eb28Ff7546d84b06c7d93Ea36885
initial code: 0xfca099ab47d2aaac3159f53cee9e6f2b6e24280490c018a6dadae753dfd2aaef
cake router deployed to: 0x7A8E280810A4Da61f1bF99d35b31086868267099
lp token: 0xdaF88Ca7966fa05762b7a8799faD617D94A802fD
cake  deployed to: 0x6701887132C11e876b8d3418451592802422Ef8c
syrupBar  deployed to: 0xdcaaEA2341Bad6EcFF2f88930a68B07f78782eDb
masterChef deployed to: 0x88536cfb44978368a9A19bb1ec6D27Ba7266F21E
sousChef deployed to: 0x18a967a31e861d135D1B221b8B212FFD4fE15d37
strategyAllTokenOnly deployed to: 0xC59426F129002C5005fbe753f9d932c99D37396F
liquidate deployed to: 0x312e39aA1674660Dc76A2D01414641313Fd2f2e6
pancake goblin proxy deployed to: 0x8851CA83bbC86c60E49287f6d88290f92b320A0a
trategyAdd deployed to: 0xC9c4074Cfe12Fb0d806a2cd25758df0a22e454A4
WithdrawMinimize deployed to: 0xCEc4677129025e3a83681386e59b1b6d17561a66
DebtToken deployed to: 0x0AC21A1B480765CCAAB6d0DF7A842F7Edd66B27D
launch_pid: 2
MdexFactory deployed to: 0x6519b2E67b53F1ea8a3D56E0b6BdF5103117f312
rounter deployed to: 0x2af38325D1a82f42c2883d4A6343acDC0914560d
LP token: 0x1330B89DeEf987F1921083C34CDA18cdd1A4c7Bd
MdxToken deployed to: 0xf4B5Ff9dB578634dc6c1bAd9A27E2157f27e71ac
bscPool deployed to: 0xe7179859cD812F4f883c2138551f76c310638270
hmdx deployed to: 0x4dA2D07216875cE2F0fd67dc82DB072B3f01d673
boardRoomHMDX deployed to: 0x57D4632459300c077aFA6afF51A5C8726504d20A
strategyLiquidateMdx deployed to: 0x9A2B233F012637f313BC48D7B59B5C37A6ad7933
busdt deployed to: 0x34Cb9b09F453D5A87720dD31867BBE56A75E30a5
mdex goblin proxy deployed to: 0xEcB55c0Ddf7A62862A8e49DC3206Ce8156F8d3b1
strategyAddTwoSidesOptimal deployed to: 0x284ee994D9D0700FBd9A8Ae79Dd4350d3d4a6D79
strategyWithdrawMinimizeTrading deployed to: 0x76d2b2701D661a6799A7015b58c5AE6D59Ab3d06

赎回数据
amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
amount1 = liquidity.mul(balance1) / _totalSupply; /
债务
totalValue

liquidity = goblin.shareToBalance(posId)
lpToken = goblin.lpToken()
balance0 = token0.balanceof(lptoken)
balance1 = token1.balanceof(lptoken)
lpToken.totalSupply


harvest
goblin
fairLanch

fairLanch.pendingRabbit(uint256 _pid, address _user)

zeroAddress = "0x0000000000000000000000000000000000000000";
//token0 传借款的token合约地址，token1 传0地址，token0 amount 传0，token1 amount  传转账金额值，最后一个传0
a = web3.eth.abi.encodeParameters(['address', 'address', 'uint256', 'uint256', 'uint256'], [borrowToken, zeroAddress, "0", ethers.utils.parseEther("0.00001"), "0"]);
b = _addStrat  //strage 合约地址
c = web3.eth.abi.encodeParameters(['address', 'bytes'], [b, a])
//参数说明，从左至右，posId(add的时候为0),pid(product id),borrow amount,data
// posId 传0，pid 这次 传0（其他交易对在告诉），borrow amount 借款金额，
// d = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256', 'bytes'], [0, 1, ethers.utils.parseEther("0.001"), c],{value:ethers.utils.parseEther("0.00001")})

await rabbit.approve(_addStrat, ethers.utils.parseEther("1"));

await bank.work(0, 1, ethers.utils.parseEther("0.001"), c, {value: ethers.utils.parseEther("0.00001")})


//2 加仓

let posId = await bank.userPosition(0);
let position  = await bank.positions(posId);
if (position.productionId == 1){
     await bank.work(posId, 0, ethers.utils.parseEther("0.001"), c, {value: ethers.utils.parseEther("0.00001")})
 }


 //3 赎回
 zeroAddress = "0x0000000000000000000000000000000000000000";

 //token0 ,token1 , which user want back :0 token0 back,1 token1 back,2 token what surplus.
 a = web3.eth.abi.encodeParameters([('address', 'address', 'uint')], [borrowToken, zeroAddress, "2"]);
 b = _withDrawStrage  //strage 合约地址
 c = web3.eth.abi.encodeParameters(['address', 'bytes'], [b, a])
 //参数说明，从左至右，posId(add的时候为0),pid(product id),borrow amount,data
 // posId 传0，pid 这次 传0（其他交易对在告诉），borrow amount 借款金额，
 // d = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256', 'bytes'], [0, 1, ethers.utils.parseEther("0.001"), c],{value:ethers.utils.parseEther("0.00001")})

 await rabbit.approve(_addStrat, ethers.utils.parseEther("1"));
 //
 await bank.work(posId, 0,0, c)


需改：
顶部地址栏 交易中

价格影响（滑点）（uniswap源码）

https://cpz4fq.axshare.com（原型）


页面数据：
 全部挖矿

        当前风险系数：
        借入资产/资产总价值 （以借款币种计价）
        综合年化收益率：
        (（1+ daily apr）的365次方  ) -1  // daily apr:日收益率

        

当前借款利息率:
TokenBank storage bank = banks[token];
uint256 totalDebt = bank.totalDebt;
uint256 totalBalance = totalToken(token);
uint256 ratePerSec = config.getInterestRate(totalDebt, totalBalance);


<!-- banks[token] . totalValue  -->

// 存款总存
totalToken[token]

