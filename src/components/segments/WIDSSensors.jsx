/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/WIDSSensors.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {
  ArrowClockwise,
  PlusCircleFill,
  XCircleFill,
} from 'react-bootstrap-icons';

const dataEntryStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
};

const actionEntryStyle = {
  textAlign: 'center',
  verticalAlign: 'middle',
  width: '2px',
};

function WIDSSensors(props) {
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);
  const [tableRowsState, setTableRowsState] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(props.url);
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
        <tr key={row.wids_sensor_id}>
          <td style={dataEntryStyle}>
            {row.wids_sensor_id}
          </td>
          <td style={dataEntryStyle}>
            {row.wids_sensor_api}
          </td>
          <td style={actionEntryStyle}>
            <Button variant="danger">
              <XCircleFill />
            </Button>
          </td>
        </tr>
      ),
    ));
  }, [dataState]);

  return (
    <Container fluid>
      <Row noGutters className="align-items-end">
        <Col>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              Registered WIDS Sensors
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
                    WIDS Sensor ID
                  </th>
                  <th style={dataEntryStyle}>
                    WIDS Sensor API
                  </th>
                  <th style={actionEntryStyle}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRowsState}
                <tr>
                  <td style={dataEntryStyle} />
                  <td style={dataEntryStyle} />
                  <td style={actionEntryStyle}>
                    <Button variant="primary">
                      <PlusCircleFill />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

WIDSSensors.propTypes = {
  url: PropTypes.string.isRequired,
};

export default WIDSSensors;
