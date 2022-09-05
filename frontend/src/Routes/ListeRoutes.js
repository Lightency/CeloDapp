import React from 'react'
import { Routes, Route } from 'react-router-dom';
import {MemberProposals} from '../compnents/Members/MemberProposals'
import CreateProposal from '../compnents/CreateProposal'
import {Wallet} from '../compnents/Wallet/Wallet';
import {Proposals} from '../compnents/Treasury/Proposals';
import Proposal from '../compnents/Treasury/Proposal';
import Distribution from '../compnents/Distribution/Distribution'
import MemberProposal from '../compnents/Members/MemberProposal';


export const ListeRoutes = () => {
  return (
    
        <Routes className="zeby">
            <Route exact path="/" element={<Wallet />} />
            <Route path="/createproposal" element={<CreateProposal />} />
            <Route path="/proposal/:id" element={<Proposal />} />
            <Route path="/members" element={<MemberProposals />} />
            <Route path="/memberproposal/:id" element={<MemberProposal />} />
            <Route path="/treasury" element={<Proposals />} />
            <Route path="/proposal/:id" element={<Proposal />} />
            <Route path="/distribution" element={<Distribution />} />
        </Routes>
    
  )
}
