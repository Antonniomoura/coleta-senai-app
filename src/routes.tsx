import React from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Points from './pages/Points';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} exact path="/" />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={Points} path="/points" />
      <Redirect from="/" to="/admin/dashboard" />
    </BrowserRouter>
  );
};

export default Routes;
