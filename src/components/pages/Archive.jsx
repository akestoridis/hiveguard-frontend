/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Archive.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ArchivedAlerts from '../segments/ArchivedAlerts';
import ArchivedFiles from '../segments/ArchivedFiles';

function Archive({ inspectionAPI, retentionAPI }) {
  return (
    <Container fluid>
      <div className="p-5 mb-4 rounded-3 bg-light text-dark text-center">
        <h1 className="display-5 fw-bold">Archive Page</h1>
      </div>
      <Row className="row-cols-1 row-cols-lg-2">
        <Col>
          <ArchivedAlerts
            dataURL={`${inspectionAPI}/alerts`}
          />
          <br />
        </Col>
        <Col>
          <ArchivedFiles
            dataURL={`${retentionAPI}/archived-files`}
          />
          <br />
        </Col>
      </Row>
    </Container>
  );
}

Archive.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
  retentionAPI: PropTypes.string.isRequired,
};

export default Archive;
