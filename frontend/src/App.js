
import { BrowserRouter as Router } from 'react-router-dom'
import { ListeRoutes } from './Routes/ListeRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { wallet } from './store/Store'
import React from 'react';
import Header from './compnents/Header'
import './css/App.css';
import SideBar from './compnents/SideBar';
import dotenv from 'dotenv'



function App() {
  dotenv.config();
  const [MyWallet, setMyWallet] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const DaoAddress = process.env.DaoAddress;
  const LtsAddress = process.env.LtsAddress;
  const VestingAddress =process.env.VestingAddress;

  return (
    <div id="root">
    <wallet.Provider value={{ MyWallet, setMyWallet, provider, setProvider, DaoAddress ,LtsAddress ,VestingAddress }}>
      <Router>
        <Header />
        <SideBar />
        <div className="content">
        <ListeRoutes />
        </div>
      </Router>
    </wallet.Provider>
    </div>
  );
}

export default App;
