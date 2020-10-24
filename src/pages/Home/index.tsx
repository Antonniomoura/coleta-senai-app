import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';
import Header from '../../components/Header/header';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <Header />
        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>

          <div className="d-flex">
            <Link to="/create-point" className="button-secudary">
            <span>
              <FiLogIn />
            </span>
              <strong>Cadastre um pronto de coleta</strong>
            </Link>
            <Link to="/points" className="ml-2">
              <strong>Status de coletas</strong>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
