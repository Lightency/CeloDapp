import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../css/SideBar.css';

const SideBar = () => {
  return (
    <>
    <div className="SideBar">
      <ul className="SideBarList">
        <li>
          <NavLink className="NavLinks" as={Link} to="/"><img src="/Wallet.png" />Wallet</NavLink>
        </li>
        <li>
          <NavLink className="NavLinks" as={Link} to="/members"><img src="/people.png" />Members</NavLink>
        </li>
        <li>
          <NavLink className="NavLinks" as={Link} to="/treasury"><img src="/money.png" />Treasury</NavLink>
        </li>
        <li>
          <NavLink className="NavLinks" as={Link} to="/distribution"><img src="/distribution.png" />Distribution</NavLink>
        </li>
      </ul>
      </div>
    </>

  );
}

export default SideBar;
