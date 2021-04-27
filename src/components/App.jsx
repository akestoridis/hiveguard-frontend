/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/App.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavigationBar from './segments/NavigationBar';
import Home from './pages/Home';
import Utilization from './pages/Utilization';
import Topology from './pages/Topology';
import PacketCounters from './pages/PacketCounters';
import ByteCounters from './pages/ByteCounters';
import HeaderFields from './pages/HeaderFields';
import BatteryPercentages from './pages/BatteryPercentages';
import Archive from './pages/Archive';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App(props) {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Home
              inspectionAPI={props.inspectionAPI}
              aggregationAPI={props.aggregationAPI}
            />
          )}
        />
        <Route
          exact
          path="/utilization"
          render={() => (
            <Utilization
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/topology"
          render={() => (
            <Topology
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/packet-counters"
          render={() => (
            <PacketCounters
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/byte-counters"
          render={() => (
            <ByteCounters
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/header-fields"
          render={() => (
            <HeaderFields
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/battery-percentages"
          render={() => (
            <BatteryPercentages
              inspectionAPI={props.inspectionAPI}
            />
          )}
        />
        <Route
          exact
          path="/archive"
          render={() => (
            <Archive
              inspectionAPI={props.inspectionAPI}
              retentionAPI={props.retentionAPI}
            />
          )}
        />
        <Route
          exact
          path="/about"
          component={About}
        />
        <Route
          component={NotFound}
        />
      </Switch>
    </BrowserRouter>
  );
}

App.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
  aggregationAPI: PropTypes.string.isRequired,
  retentionAPI: PropTypes.string.isRequired,
};

export default App;
