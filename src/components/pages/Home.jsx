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

function Home({ inspectionAPI }) {
  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Home Page</h1>
      </Jumbotron>
      <Row>
        <Col />
        <Col />
        <Col>
          <WIDSSensors
            url={`${inspectionAPI}/wids-sensors`}
          />
        </Col>
      </Row>
    </Container>
  );
}

Home.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default Home;
