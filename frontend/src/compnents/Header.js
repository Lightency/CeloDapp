import React, { useEffect, useState } from "react";
import "../css/Header.css";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { wallet } from '../store/Store';
import * as ethers from 'ethers'
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'



const useStyles = makeStyles({
  Button: {
    background: 'linear-gradient(45deg, #0d9be5 30%, #30a8f2 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgb(105 212 255 / 30%)',
    color: 'white',
    height: 38,
    padding: '0 30px',
    margin: "1.6em"
  },


});









function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { MyWallet, setMyWallet } = React.useContext(wallet)

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const provider = new WalletConnectProvider({
    rpc: {
      3: "https://ropsten.infura.io/v3/43dbf6e08a944c228039fe33c5db87e5",
      42220: "https://forno.celo.org",
      44787: "https://alfajores-forno.celo-testnet.org"
    },

  });

  // connect to metamask!!********************************
  // const connect = async () =>{
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   await provider.send("eth_requestAccounts", []).then(()=>{const signer = provider.getSigner();
  //     setMyWallet(signer);
  //   })

  // }

  const connect = async () => {
    console.log("connecting...");
    await provider.enable().then(() => {
      setConnected(true);
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const SignerWallet = web3Provider.getSigner();
      setMyWallet(SignerWallet);


    });

  };
  // Subscribe to accounts change
  provider.on("accountsChanged", async (accounts) => {
    console.log(accounts);
    setAddress(accounts[0]);

  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });

  // Subscribe to session disconnection
  provider.on("disconnect", (code, reason) => {
    setConnected(false);
    console.log(code, reason);
  });
  const disconnect = async () => {
    await provider.disconnect();
  }

  React.useEffect(() => {



  }, [MyWallet]);

  return (
    <>
      <Navbar className="p-0 m-0" bg="dark" variant="dark"   style={{height:"80px",position: "sticky",top: 0, zIndex: 999}}>


        <Navbar.Brand className="Navstart" as={Link} to={'/'}><img className="logo" src="/logo.png"></img><h4>Lightency</h4></Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {connected ? <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
             {address}
            </Dropdown.Toggle>

            <Dropdown.Menu id="dropDownMenu" className="p-0 m-0">
            <Button style={{fontSize:"0.9em"}} variant="secondary" size="lg" onClick={()=>{disconnect()}}><strong style={{color:"white"}}>Disconnect</strong></Button>
            </Dropdown.Menu>
          </Dropdown> :
            <button className={classes.Button} onClick={connect}>Connect Wallet</button>
          }
        </Navbar.Collapse>

      </Navbar>

    </>
  );
}

export default Header;
