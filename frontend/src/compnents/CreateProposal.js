import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import '../css/CreateProposal.css'
import Button from '@mui/material/Button';
import ABI from '../ABI/DaoAbi.json'
import { wallet } from '../store/Store'
import { BigNumber, ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  TextField: {
    width: '100%',
    backgroundColor: '#FFFFFF',


  },
});


const CreateProposal = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState("");
  const [votingDays, setVotingDays] = useState(0);


  const { MyWallet, setMyWallet } = useContext(wallet)
  const [Type, setType] = useState(0);

  const { DaoAddress } = React.useContext(wallet);
  const Dao = new ethers.Contract(DaoAddress, ABI.DaoAbii, MyWallet)
  const handleSubmit = async () => {
    await Dao.createProposal(title, description, address, amount, votingDays).then((res) => {
      navigate('/')
    });


  }
  const CreateMemberProposal = async () => {
    await Dao.CreateAddMemberProposal(description, address, votingDays).then((res) => {
      navigate('/');
    })
  }

  const getwalletAddress = async () => {
    const address = await MyWallet.getAddress();
    setWalletAddress(address);

  }
  useEffect(() => {
    MyWallet == null ? console.log("connect your wallet ") : getwalletAddress();

  }, [Type]);
  const handleChange = (e) => {
    if (e.target.name === "beneficary") {
      setAddress(e.target.value);
    }
    else if (e.target.name === "description") {
      setDescription(e.target.value);
    }
    else if (e.target.name === "timer") {
      setVotingDays(e.target.value);
    }
    else if (e.target.name === "title") {
      setTitle(e.target.value);
    }
    else {
      const amount = (e.target.value) * 10 ** 8;


      setAmount(amount)

    }

  }
  return (
    <div className="CreateProposalOption" ><div >
      {Type === 1 ? <div><h1>Creating Treasury funding proposal</h1><Button variant="contained" style={{ width: "-webkit-fill-available", backgroundColor: "#757425" }} onClick={(e) => { setType(0) }}>Switch to Member proposal</Button> </div> : <div><h1>Creating Membership proposal</h1> <Button variant="contained" style={{ width: "-webkit-fill-available", backgroundColor: "#757425" }} onClick={(e) => { setType(1) }}>Switch to transfer funds proposal</Button></div>}
    </div>
      <div>
        {Type === 0 ? <div className='CreateProposal' >
          <TextField className={classes.TextField} onChange={handleChange} id="filled-basic" label="Beneficary Address" variant="filled" name="beneficary" />
          <TextField className={classes.TextField} onChange={handleChange} id="filled-basic" label="Description" variant="filled" name="description" />
          <TextField className={classes.TextField}
            onChange={handleChange}
            id="filled-basic"
            label="Voting days"
            type="number"
            variant="filled"
            name="timer"
          />
          <Button onClick={CreateMemberProposal} variant="contained">Submit</Button>

        </div> : <div className='CreateProposal' >
          <TextField className={classes.TextField} onChange={handleChange} id="filled-basic" label="Title" variant="filled" name="title" />

          <TextField className={classes.TextField} onChange={handleChange} id="filled-basic" label="Beneficary Address" variant="filled" name="beneficary" />
          <TextField className={classes.TextField} onChange={handleChange} id="filled-basic" label="Description" variant="filled" name="description" />
          <TextField className={classes.TextField}
            onChange={handleChange}
            id="filled-basic"
            label="amount in ether"
            type="number"
            variant="filled"
            name="amount"
          />
          <TextField className={classes.TextField}
            onChange={handleChange}
            id="filled-basic"
            label="Voting days"
            type="number"
            variant="filled"
            name="timer"
          />
          <Button onClick={handleSubmit} variant="contained">Submit</Button>

        </div>
        }
      </div> </div>
  );
}

export default CreateProposal;
