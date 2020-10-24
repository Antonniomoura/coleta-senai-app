import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './styles.css';

import api from '../../services/api';

import { isEmpty } from 'lodash';
import { toast, ToastContainer } from 'react-toastify';


const Login = (props) => {

  useEffect(() => {
    autorized();
  }, []);

  const [logged, setLogged] = useState(false);

  function error() {
    return toast.error('🦄Error ao efetuar login!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  function setLogin() {

  }

  async function autorized() {
    await api.get('api/me').then(success => {
      setLogged(true);
    }).catch(error => {
      localStorage.clear();
      return props.history.push(`/login`);
    });
  }

  function login() {
    api.post('auth/login', { username: email, password }).then(data => {
      if (data.data) {
        const { token } = data.data;
        localStorage.setItem('token', token);
        window.location.replace('/');
      }
      setLogin();
    }).catch(err => {
      error();
    });
  }

  if (logged) {
    props.history.push(`/`);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);

  function doLogin() {
    setSubmit(true);
    if (!email || !password) {
      return null;
    }
  }

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
      <ToastContainer/>
      <form onSubmit={handleSubmit} autoComplete="off">
        <header>
          <img src={logo} alt="Ecoleta" className="mb-5" />
        </header>

        <fieldset>
          <legend>
            <h2>Login</h2>
          </legend>
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

          <Link to="/register" className="ml-2">
            <button type="button" className="btn btn-primary mr-2">Registrar</button>
          </Link>
          <button type="button" onClick={login}>Fazer Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
