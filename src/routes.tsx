import React from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Points from './pages/Points';
import Login from './pages/Login';
import Register from './pages/Register';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={CreatePoint} path="/create-point" />
      <Route component={Points} path="/points" />
      <Route component={Login} path="/login" />
      <Route component={Register} path="/register" />
      <Route component={Home} exact path="/" />
    </BrowserRouter>
  );
};

export default Routes;
