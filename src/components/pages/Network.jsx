/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Network.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Topology from '../segments/Topology';

function Network({ inspectionAPI }) {
  const [panIdentifiersState, setPANIdentifiersState] = useState([]);
  const [panIDOptions, setPANIDOptions] = useState([]);
  const [selIDState, setSelIDState] = useState('');
  const [selIntvlState, setSelIntvlState] = useState('1');
  const [topologyURLState, setTopologyURLState] = useState(null);

  const fetchPANIdentifiers = async () => {
    try {
      const response = await fetch(`${inspectionAPI}/pan-identifiers`);
      if (
        response.ok
        && response.headers.get('content-type').includes('application/json')
      ) {
        setPANIdentifiersState(await response.json());
      } else {
        setPANIdentifiersState([]);
      }
    } catch (err) {
      setPANIdentifiersState([]);
    }
  };

  useEffect(() => {
    fetchPANIdentifiers();
  }, []);

  useEffect(() => {
    if (panIdentifiersState.length === 0) {
      setPANIDOptions([]);
      setSelIDState('');
    } else {
      setPANIDOptions(Array.from(
        panIdentifiersState,
        (panid) => (
          <option key={panid} value={panid}>
            {panid}
          </option>
        ),
      ));
      setSelIDState(panIdentifiersState[0]);
    }
  }, [panIdentifiersState]);

  useEffect(() => {
    if (inspectionAPI && selIDState && selIntvlState) {
      setTopologyURLState(
        `${inspectionAPI}/topology/${selIDState}`
        + `?hours=${selIntvlState}`,
      );
    } else {
      setTopologyURLState(null);
    }
  }, [selIDState, selIntvlState]);

  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Network Page</h1>
        <br />
        <br />
        <Container>
          <Row
            className="row-cols-1 row-cols-md-2"
            style={{ fontSize: 'x-large' }}
          >
            <Col>
              <label htmlFor="pan_id_options">
                <b>
                  PAN ID:
                </b>
                {' '}
                <select
                  id="pan_id_options"
                  value={selIDState}
                  onChange={(event) => setSelIDState(event.target.value)}
                >
                  {panIDOptions}
                </select>
              </label>
            </Col>
            <Col>
              <label htmlFor="time_interval_options">
                <b>
                  Time Interval:
                </b>
                {' '}
                <select
                  id="time_interval_options"
                  value={selIntvlState}
                  onChange={(event) => setSelIntvlState(event.target.value)}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                  <option value="12">12 hours</option>
                  <option value="16">16 hours</option>
                  <option value="24">24 hours</option>
                  <option value="32">32 hours</option>
                  <option value="48">48 hours</option>
                </select>
              </label>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Topology
        dataURL={topologyURLState}
      />
    </Container>
  );
}

Network.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default Network;