import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';

const Header = () => {
  return <header>
    <Link to="/" className="ml-2">
      <img src={logo} alt="SENAI Coleta" />
    </Link>
  </header>;
};

export default Header;
