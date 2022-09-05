import React, { useState, useEffect } from 'react';
import { BigNumber, ethers } from 'ethers';
import ABI from '../../ABI/DaoAbi.json'
import { wallet } from '../../store/Store'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { makeStyles } from '@mui/styles';

import '../../css/Proposals.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
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





export const Proposals = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const { MyWallet, setMyWallet } = React.useContext(wallet);

    const { DaoAddress } = React.useContext(wallet);
    const Dao = new ethers.Contract(DaoAddress, ABI.DaoAbii, MyWallet);
    
    const getallProposals = async () => {
    
        const allprops = await Dao.callStatic.getProposals();


        setProposals(allprops);

        


    }
    useEffect(() => {
        MyWallet === null ? console.log('still not connected') : getallProposals();




    }, [MyWallet]);
    return (

        <>
            <button className={classes.Button} onClick={() => { navigate('/createproposal') }} >Create Proposal</button>
            <div className="proposals">
                {proposals.map((proposal) => {
                    return <Card className="card">
                        <Card.Header as="h5" style={{backgroundColor:"#212529",color:"#FFFFFF"}}>Proposal N°{BigNumber.from(proposal.id).toString()}</Card.Header>
                        <Card.Body className="cardbody" >
                            <Card.Title>Proposal title</Card.Title>
                            <Card.Text>
                                {proposal.description}
                            </Card.Text>
                            <Button variant="primary" onClick={() =>{navigate('/proposal/'+BigNumber.from(proposal.id).toString())}}>View more</Button>
                        </Card.Body>
                    </Card>
                })}</div></>


    )
}