/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Home.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import WIDSSensors from '../segments/WIDSSensors';
import UnreadAlerts from '../segments/UnreadAlerts';
import NearbyNetworks from '../segments/NearbyNetworks';

function Home({ inspectionAPI, aggregationAPI }) {
  return (
    <Container fluid>
      <div className="p-5 mb-4 rounded-3 bg-light text-dark text-center">
        <h1 className="display-5 fw-bold">Home Page</h1>
      </div>
      <Row className="row-cols-1 row-cols-lg-3">
        <Col>
          <WIDSSensors
            dataURL={`${inspectionAPI}/wids-sensors`}
            registryURL={`${aggregationAPI}/registry`}
          />
          <br />
        </Col>
        <Col>
          <UnreadAlerts
            dataURL={`${inspectionAPI}/alerts`}
          />
          <br />
        </Col>
        <Col>
          <NearbyNetworks
            dataURL={`${inspectionAPI}/nearby-networks`}
          />
          <br />
        </Col>
      </Row>
    </Container>
  );
}

Home.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
  aggregationAPI: PropTypes.string.isRequired,
};

export default Home;
