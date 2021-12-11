import React, {useEffect, useState} from 'react';
import './App.css';
import { init, mintToken, getBalance, sendMoney, wc } from './Web3Client';

function App() {
  const [minted, setMinted] = useState(false);
  const [balance, setBalance] = useState(0);

  const mint = () => {
    mintToken().then(tx => {
      console.log(tx);
      setMinted(true);
    }).catch(err => {
      console.log(err);
    })
  }

  const getBalanc = () => {
    getBalance()
    .then(_balance => {
      console.log("_balance : "+_balance);
      setBalance(_balance)
    })
    .catch(err => {
      console.log(err);
    })
  }

  const makeTransfer = () => {
    sendMoney()
    .then(res => console.log(`makeTransfer : ${res}`))
    .catch(err => {
      console.log(err);
    })
  }

  const walletconnect = () => {
    wc()
    .then(res => console.log(`walletconnect : ${res}`))
    .catch(err => {
      console.log(err);
    })
  }

  /*useEffect(() => {
    init();
  }, [])*/

  return (
    <div className="App">
      {!minted ? 
        <button onClick={()=>mint()}>Mint token</button>
        : <p>Token minted success</p>
      }
      <button onClick={()=>getBalanc()}>Get Balance</button>
      <button onClick={()=>makeTransfer()}>Send Money</button>
      <button onClick={()=>walletconnect()}>Wallect connect</button>

      <p>Balance : {balance}</p>
    </div>
  );
}

export default App;
