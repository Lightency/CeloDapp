import React,{useState,useEffect} from 'react';
import { Link , useParams} from 'react-router-dom';
import { BigNumber, ethers } from 'ethers';
import ABI from '../../ABI/DaoAbi.json'
import { wallet } from '../../store/Store'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../../css/Proposal.css';


const MemberProposal = () => {
  const {id} = useParams();
  const [check, setcheck] = useState(0);
  const { MyWallet, setMyWallet } = React.useContext(wallet);
  const [proposal, setProposal] = useState(null);

  const { DaoAddress } = React.useContext(wallet);
  const Dao = new ethers.Contract(DaoAddress, ABI.DaoAbii, MyWallet);
  const vote = async (proposalType, id, value) => {

    await Dao.vote(proposalType, id, value);



}
const processProposal = async (id) => {
    await Dao.processProposal(id).then(console.log("done")).catch((e) => { console.log("error:" + e) });
}
const getProposal = async (id) => {
  await Dao.getMemberProposalByID(id).then((res)=>{setProposal(res);}).catch((e) => { console.log(e)});
 

}
const Checkproposal = (proposal) => {
  if (proposal===undefined){
    setcheck(check+1);
  }
}
const getDate= (epoch)=>{
  let date = new Date(epoch*1000);
  return date.toUTCString();

}
useEffect(() => {
  getProposal(id);
  Checkproposal(proposal);
  

  

}, [check]);
  return (
    <>{proposal==null || MyWallet==null ? null : <Card id="proposalById" className=" w-100 m-1 text-center">
    <Card.Header style={{backgroundColor:"black",color:"white",fontSize:"2em"}}>Add Member Proposal</Card.Header>
    <Card.Body>
      <Card.Title>Proposal N°: {BigNumber.from(proposal.id).toString()}</Card.Title>
       <ul><li><strong>Description</strong>{proposal.description}</li> 
       <li><strong>Beneficary</strong>{proposal.MemberAddress}</li> 
       <li><strong>Votes For</strong>{BigNumber.from(proposal.votesFor).toString()}</li> 
       <li><strong>Votes Against</strong>{BigNumber.from(proposal.votesAgainst).toString()}</li>  
       </ul>

       
      <Button onClick={() =>{vote(0,proposal.id,true)}} style={{width:"25%"}} variant="success">Yes</Button>
      <Button onClick={() =>{vote(0,proposal.id,false)}} style={{width:"25%"}} variant="danger">No</Button>
      
    </Card.Body>
    <Card.Footer className="text-muted">Voting deadline: {getDate(BigNumber.from(proposal.livePeriod).toNumber())}</Card.Footer>
  </Card>
        

    }
    </>
  );
}

export default MemberProposal;
