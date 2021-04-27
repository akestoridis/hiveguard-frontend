/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Home.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import WIDSSensors from '../segments/WIDSSensors';
import UnreadAlerts from '../segments/UnreadAlerts';
import NearbyNetworks from '../segments/NearbyNetworks';

function Home({ inspectionAPI, aggregationAPI }) {
  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Home Page</h1>
      </Jumbotron>
      <Row className="row-cols-1 row-cols-lg-3">
        <Col>
          <WIDSSensors
            dataURL={`${inspectionAPI}/wids-sensors`}
            registryURL={`${aggregationAPI}/registry`}
          />
        </Col>
        <Col>
          <UnreadAlerts
            dataURL={`${inspectionAPI}/alerts`}
          />
        </Col>
        <Col>
          <NearbyNetworks
            dataURL={`${inspectionAPI}/nearby-networks`}
          />
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
