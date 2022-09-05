// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Light is ERC20, ERC20Burnable, Ownable {

    constructor() ERC20("Light", "Lts") {}
    function burn(uint256 amount) public override{
   
    _burn(msg.sender, amount);

    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    function decimals() public override view returns(uint8){
        return 8;
    }
}

contract CeloDAO is ReentrancyGuard, AccessControl {
    bytes32 public constant MEMBER = keccak256("MEMBER");
    uint32 constant minimumVotingPeriod =1 minutes;
    uint256 numOfDaos;
    uint256 numOfProposals;
    uint256 numOfMemberProposals;
    uint256 numOfMembers;
    IERC20 token;
    struct MemberProposal{
        uint256 proposalTypeId;
        uint256 id;
        uint256 livePeriod;
        uint256 votesFor;
        uint256 votesAgainst;
        string description;
        bool votingPassed;
        bool processed;
        address MemberAddress;
    }

    struct Proposal {
        uint256 proposalTypeId;
        uint256 id;
        string title;
        uint256 amount;
        uint256 livePeriod;
        uint256 votesFor;
        uint256 votesAgainst;
        string description;
        bool votingPassed;
        bool paid;
        address payable Address;
        address proposer;
        address paidBy;
    }
    mapping(uint256 =>address) public DAOs;
    mapping(uint256 => Proposal) private Proposals;
    mapping(uint256 => MemberProposal) private MemberProposals;
    mapping(address => uint256[]) private MemberVotes;
    mapping(address => uint256[]) private MemberProposalsVotes;
    mapping(address => uint256) private Members;
    mapping(uint256=> address) private AllMembers;
    event NewMemberProposal(address indexed fromAddress,address newMember);
    event ContributionReceived(address indexed fromAddress, uint256 amount);
    event NewProposal(address indexed proposer, uint256 amount);
    event PaymentTransfered(
        address indexed Member,
        address indexed Address,
        uint256 amount
    );
    event MyLog(string desctription,address value);

    modifier onlyMember(string memory message) {
        
        require(hasRole(MEMBER, msg.sender), message);
        _;
    }
    constructor(address asset){
        makeMember(msg.sender);
        token = IERC20(asset);

    }
    function CreateAddMemberProposal(string calldata description,address Address,uint256 votingDays) external onlyMember("Only Members are allowed to add members") {
        uint256 proposalId = numOfMemberProposals++;
        MemberProposal storage proposal = MemberProposals[proposalId];
        proposal.proposalTypeId = 0;
        proposal.id = proposalId;
        if (votingDays>0){
            uint256 votingTime = votingDays * 1 days;
            proposal.livePeriod = block.timestamp + votingTime;

        }
        else{
            proposal.livePeriod = block.timestamp + minimumVotingPeriod;

        }
        proposal.MemberAddress = Address;
        proposal.description = description;
        emit NewMemberProposal(msg.sender,Address);


    }
    function processProposal(uint256 proposalId) external onlyMember("only Members are able to process proposals"){
        MemberProposal storage proposal = MemberProposals[proposalId];
        if (proposal.processed)
            revert("This proposal is already processed");
        if (proposal.livePeriod > block.timestamp){
            revert("Voting period did not end");
        }
        if(proposal.votesFor <= proposal.votesAgainst)
            revert("The proposal does not have the required amount of votes to pass");
        proposal.processed=true;
        makeMember(proposal.MemberAddress);
    }


    function pay(uint256 proposalId)
        external
        onlyMember("Only Members are allowed to make payments")
    {
        Proposal storage proposal = Proposals[proposalId];

        if (proposal.paid)
            revert("Payment has been made to this ");

        if (proposal.livePeriod > block.timestamp){
            revert("Voting period did not end");
        }

        if (proposal.votesFor <= proposal.votesAgainst)
            revert(
                "The proposal does not have the required amount of votes to pass"
            );

        proposal.paid = true;
        proposal.paidBy = msg.sender;
        

        emit PaymentTransfered(
            msg.sender,
            proposal.Address,
            proposal.amount
        );


        token.transfer(proposal.Address,proposal.amount);
    }

    function createProposal(
        string calldata title,
        string calldata description,
        address Address,
        uint256 amount,
        uint256 votingDays
    )
        external
        onlyMember("Only Members are allowed to create proposals")
    {
        uint256 proposalId = numOfProposals++;
        Proposal storage proposal = Proposals[proposalId];
        proposal.proposalTypeId = 1;
        proposal.id = proposalId;
        proposal.proposer = payable(msg.sender);
        proposal.description = description;
        proposal.title=title;
        proposal.Address = payable(Address);
        proposal.amount = amount;
        if (votingDays>0){
            uint256 votingTime = votingDays * 1 days;
            proposal.livePeriod = block.timestamp + votingTime;

        }
        else{
            proposal.livePeriod = block.timestamp + minimumVotingPeriod;

        }
        emit NewProposal(msg.sender, amount);
    }

    function vote(uint256 proposaltype,uint256 proposalId, bool supportProposal)
        external
        onlyMember("Only Members are allowed to vote")
    {
       if (proposaltype>0){ Proposal storage proposal = Proposals[proposalId];

        votable(1,proposalId);

        if (supportProposal) proposal.votesFor++;
        else proposal.votesAgainst++;

        MemberVotes[msg.sender].push(proposal.id);}
        else{
        MemberProposal storage proposal = MemberProposals[proposalId];
        votable(0,proposalId);



        if (supportProposal) proposal.votesFor++;
        else proposal.votesAgainst++;
        MemberProposalsVotes[msg.sender].push(proposal.id);
        }
    }

    function votable(uint256 proposaltypeId,uint256 _id) public returns(bool) {
       if (proposaltypeId>0){
            Proposal storage proposal = Proposals[_id];
        if (
            proposal.votingPassed ||
            proposal.livePeriod <= block.timestamp
        ) {
            proposal.votingPassed = true;
            revert("Voting period has passed on this proposal");
        }

        uint256[] memory tempVotes = MemberVotes[msg.sender];
        for (uint256 votes = 0; votes < tempVotes.length; votes++) {
            if (proposal.id == tempVotes[votes])
                revert("This Member already voted on this proposal");
        }
        return true;
       }
       else{
            MemberProposal storage proposal = MemberProposals[_id];
        if (
            proposal.votingPassed ||
            proposal.livePeriod <= block.timestamp
        ) {
            proposal.votingPassed = true;
            revert("Voting period has passed on this proposal");
        }

        uint256[] memory tempVotes = MemberProposalsVotes[msg.sender];
        for (uint256 votes = 0; votes < tempVotes.length; votes++) {
            if (proposal.id == tempVotes[votes])
                revert("This Member already voted on this proposal");
        }
        return true;
       }
    }

    

    receive() external payable {
        emit ContributionReceived(msg.sender, msg.value);
    }

    function makeMember(address Address) internal { 
        uint256 currentMembersNumber = numOfMembers++;
        _setupRole(MEMBER, Address);
        Members[Address]=1;
        AllMembers[currentMembersNumber]=msg.sender;
        
    }

    function getMembersList() public view returns(address[] memory members){
        members = new address[](numOfMembers);
        for (uint256 index =0; index<numOfMembers; index++){
            members[index]=AllMembers[index];
        }
    }

    function getProposals()
        public
        view
        returns (Proposal[] memory props)
    {
        props = new Proposal[](numOfProposals);

        for (uint256 index = 0; index < numOfProposals; index++) {
            props[index] = Proposals[index];
        }
    }
    function getMemberProposals()
        public
        view
        returns (MemberProposal[] memory props)
    {
        props = new MemberProposal[](numOfMemberProposals);

        for (uint256 index = 0; index < numOfMemberProposals; index++) {
            props[index] = MemberProposals[index];
        }
    }

    function getProposal(uint256 proposalId)
        public
        view
        returns (Proposal memory prop)
    {
        prop = Proposals[proposalId];
    }
    function getMemberProposalByID(uint256 proposalId) public view returns(MemberProposal memory prop){
        prop = MemberProposals[proposalId];
    }

    function getMemberVotes()
        public
        view
        onlyMember("User is not a Member")
        returns (uint256[] memory)
    {
        return MemberVotes[msg.sender];
    }

    function getMemberBalance()
        public
        view
        onlyMember("User is not a Member")
        returns (uint256)
    {
        return Members[msg.sender];
    }

    function isMember(address Address) public view returns (bool) {
        return Members[Address] > 0;
    }
    
}











