/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/NearbyNetworks.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';

const dataEntryStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
};

function NearbyNetworks({ dataURL }) {
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);
  const [tableRowsState, setTableRowsState] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(dataURL);
      if (
        response.ok
        && response.headers.get('content-type').includes('application/json')
      ) {
        setDataState(await response.json());
        setFetchState(`Last Updated: ${new Date().toLocaleTimeString()}`);
      } else {
        setFetchState(
          `Unsuccessful data fetching at ${new Date().toLocaleTimeString()}`,
        );
      }
    } catch (err) {
      setFetchState(
        `Failed to fetch data at ${new Date().toLocaleTimeString()}`,
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTableRowsState(Array.from(
      dataState,
      (row) => (
        <tr key={`${row.panid}-${row.epid}`}>
          <td style={dataEntryStyle}>
            {row.panid}
          </td>
          <td style={dataEntryStyle}>
            {row.epid}
          </td>
        </tr>
      ),
    ));
  }, [dataState]);

  return (
    <Container fluid>
      <Row noGutters className="align-items-end">
        <Col xs={8}>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              Nearby Networks
            </b>
          </p>
        </Col>
        <Col>
          <p style={{ textAlign: 'right' }}>
            <i style={{ verticalAlign: 'bottom', fontSize: 'small' }}>
              {fetchState}
            </i>
            {' '}
            <Button variant="primary" onClick={() => fetchData()}>
              <ArrowClockwise />
            </Button>
          </p>
        </Col>
      </Row>
      <Row noGutters className="align-items-start">
        <Col>
          <div style={{ overflow: 'auto', height: '400px' }}>
            <Table striped bordered>
              <thead>
                <tr>
                  <th style={dataEntryStyle}>
                    PAN ID
                  </th>
                  <th style={dataEntryStyle}>
                    Extended PAN ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRowsState}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

NearbyNetworks.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

export default NearbyNetworks;
