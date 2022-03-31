/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/App.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

function App({ inspectionAPI, aggregationAPI, retentionAPI }) {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={
            (
              <Home
                inspectionAPI={inspectionAPI}
                aggregationAPI={aggregationAPI}
              />
            )
          }
        />
        <Route
          path="/utilization"
          element={<Utilization inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/topology"
          element={<Topology inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/packet-counters"
          element={<PacketCounters inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/byte-counters"
          element={<ByteCounters inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/header-fields"
          element={<HeaderFields inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/battery-percentages"
          element={<BatteryPercentages inspectionAPI={inspectionAPI} />}
        />
        <Route
          path="/archive"
          element={
            (
              <Archive
                inspectionAPI={inspectionAPI}
                retentionAPI={retentionAPI}
              />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

App.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
  aggregationAPI: PropTypes.string.isRequired,
  retentionAPI: PropTypes.string.isRequired,
};

export default App;
