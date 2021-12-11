import Web3 from 'web3';
import NFTContractBuild from 'contracts/NFT.json'
import WalletConnectProvider from '@walletconnect/web3-provider';

//const providerUrl = process.env.PROVIDER_URL || 'https://localhost:8545';
let bep20Contract;
let nftContract;
let selectedAccount;
let isInitialized = false;
const bep20Abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


export const init = async () => {

    const provider = window.ethereum; // check if etherum is supported by window
    if(typeof provider !== "undefined"){
      // Metamask is installed 

      provider.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== selectedAccount) {
          selectedAccount = accounts[0];
          console.log(`Selected account is : ${selectedAccount}`);
          
            
        }
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
          return;
        }
      });


      provider.on('accountsChanged', accounts =>{
        
        selectedAccount = accounts[0];
        console.log(`Selected account is : ${selectedAccount}`);
      });

      provider.on('chainChanged', chainId =>{
        console.log(`Chaind Id : ${chainId}`);
        window.location.reload();
      });
    }else{
      console.log("Ethereum not found");
      return;
    }


    /*

    // others provider
    
    const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();

    console.log(`networkId : ${networkId}`);

    console.log(`address : ${JSON.stringify(NFTContractBuild.networks["1638501669539"].address,null,4)}`);

    nftContract = new web3.eth.Contract(
        NFTContractBuild.abi, 
        NFTContractBuild.networks["1638501669539"].address
    );*/


    isInitialized = true;
}

export const mintToken = async () => {
    if(!isInitialized){
        await init();
    }
    /*return nftContract.methods                                                                                 
    .mint(selectedAccount)
    .send({from: selectedAccount});*/
}



// Connect to bsc chain and get price
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

export const getBalance = async () => {
    if(!isInitialized){
        await init();
    }

    console.log("xxx : "+selectedAccount);
    return web3.eth.getBalance(selectedAccount)
    .then( balance => {
        console.log(`getBalance : ${balance/Math.pow(10, 18)}`)
        return balance/Math.pow(10, 18);
    }).catch(err=>console.log(`ErrBsc : ${err}`));
}

export const sendMoney = async () => {
    if(!isInitialized){
        await init();
    }

    const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    return web3.eth.sendTransaction({
        from: "0x03AD8D31E1448d59ba83Dba0772E05019141E765",
        to: '0xa5F7e7a696F90F37eFaF869641037c6261C87Ad4',
        value: '10000000000000'
    }, function(err, transactionHash) {
        if (err) {
          console.log(err);
          } else {
            console.log(transactionHash);
            return transactionHash;
         }
      });
}


export const wc = async () => {
    const web3 = new Web3('https://bsc-dataseed.binance.org/');

    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
        rpc: {
            56: "https://bsc-dataseed.binance.org/"
        },
    });
  
    //  Enable session (triggers QR Code modal)
    await provider.enable();

    //  Get Accounts
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
}