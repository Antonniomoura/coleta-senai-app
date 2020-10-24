import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api';

import { isEmpty } from 'lodash';
import { toast, ToastContainer } from 'react-toastify';


const Register = (props) => {

  useEffect(() => {
    // autorized();
  }, []);

  function error() {
    return toast.error('🦄Error ao salvar!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  function success() {
    return toast.success('🦄Usuario criado!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  function saveUser() {
    setSubmit(true);
    if (!name || !email || !password) {

    }
    api.post('users', { name, email, password }).then(data => {
      success();
      props.history.push(`/login`);
    }).catch(err => {
      error();
    });
  }

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);

  const history = useHistory();

  useEffect(() => {
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await api.post('points', {
      email,
      password
    });

    alert('Ponto de coleta criado');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <ToastContainer />
      <form onSubmit={handleSubmit} autoComplete="off">
        <header>
          <img src={logo} alt="Ecoleta" className="mb-5" />
        </header>

        <fieldset className="mb-2">
          <legend>
            <h2>Registrar</h2>
          </legend>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Name</label>
              <input
                type="text"
                name="name"
                className={submit && isEmpty(email) ? 'error-input' : ''}
                id="name"
                value={name}
                onChange={event => {
                  setName(event.target.value);
                }}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                className={submit && isEmpty(email) ? 'error-input' : ''}
                id="email"
                value={email}
                onChange={event => {
                  setEmail(event.target.value);
                }}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-2">
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={submit && isEmpty(password) ? 'error-input' : ''}
              name="password"
              id="password"
              value={password}
              onChange={event => {
                setPassword(event.target.value);
              }}
            />
          </div>
        </fieldset>
        <div className="d-flex justify-content-end">

          <Link to="/login" className="ml-2">
            <button type="button" className="btn btn-primary mr-2 button-secudary">Ir para Login</button>
          </Link>
          <button type="button" onClick={saveUser}>Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
