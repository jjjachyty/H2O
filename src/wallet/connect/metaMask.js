import Web3 from "web3"
const isInstalled = () => {
  const {
    ethereum
  } = window;
  return Boolean(ethereum);
};
export const connectInfo = async () => {
  if(window.ethereum){
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61'  }], 
      });
      connectInfoDetail()
    } catch (error) {
      console.log('wallet_switchEthereumChain' ,error);
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x61',
                rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
              },
            ],
          });
          connectInfoDetail()

        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }
}
export const connectInfoDetail = async () => {
  if (!isInstalled()) {
      alert('您未安装metamask')
      return 
  };
  console.log('selectedAddress',ethereum.selectedAddress );
  if (!ethereum.selectedAddress) return 
  // window.web3 = new Web3(ethereum);
  
  const accounts = await ethereum.request({
    method: 'eth_accounts'
  });
  if (accounts.length === 0) {
    __ownInstance__.$store.commit("isConnected", false);
    return false;
  }
  const address = accounts[0];
  const chainId = await ethereum.request({
    method: 'eth_chainId'
  });
  getBaseData(chainId,accounts,address)
  ethereum.on('accountsChanged', () => {
    // window.location.reload();
    __ownInstance__.$store.dispatch("disconnectMetaMask");
  });
  ethereum.on('chainChanged', (res) => {
    // window.location.reload();
    // connectInfo()
  });
}
export const connect = async () => {
  console.log('connect');
  ethereum
    .request({
      method: 'eth_requestAccounts'
    })
    .then(() => {
      connectInfo()
    })
    .catch((err) => {
      if (err.code === 4001) {
        console.log(err.message);
      }
    });
};

export const connectWallet = ()=>{
  if (window.ethereum.isMetaMask) {
      connect();
  } else {
      alert("您未安装MetaMask")
  }
}


async  function getBaseData(chainId,accounts,address){
  __ownInstance__.$store.commit("getChainId", chainId);
  __ownInstance__.$store.commit("getAccounts", accounts);
  __ownInstance__.$store.commit("getAddress", address);
  __ownInstance__.$store.commit("isConnected", true);
  __ownInstance__.$store.dispatch("getTokenDecimals");
  __ownInstance__.$store.dispatch("getInviteList");
  __ownInstance__.$store.dispatch("getAirdropValue");
  __ownInstance__.$store.dispatch("getAirDropDrawed");
  __ownInstance__.$store.dispatch("getRTokenBalance");
  __ownInstance__.$store.dispatch("DepositTokenList");

  
}
