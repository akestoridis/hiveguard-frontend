/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/index.jsx
 * @license Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App
      inspectionAPI={rootElement.getAttribute('inspection-api')}
      aggregationAPI={rootElement.getAttribute('aggregation-api')}
      retentionAPI={rootElement.getAttribute('retention-api')}
    />
  </React.StrictMode>,
  rootElement,
);
