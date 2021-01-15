/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/WIDSSensors.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';

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
          <td>{row.wids_sensor_id}</td>
          <td>{row.wids_sensor_api}</td>
        </tr>
      ),
    ));
  }, [dataState]);

  return (
    <>
      <h3 align="center">
        Registered WIDS Sensors
      </h3>
      <p style={{ textAlign: 'right', fontStyle: 'italic' }}>
        <small>
          {fetchState}
        </small>
        {' '}
        <Button variant="primary" onClick={() => fetchData()}>
          <ArrowClockwise />
        </Button>
      </p>
      <div style={{ overflow: 'auto', height: '400px' }}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>WIDS Sensor ID</th>
              <th>WIDS Sensor API</th>
            </tr>
          </thead>
          <tbody>
            {tableRowsState}
          </tbody>
        </Table>
      </div>
    </>
  );
}

WIDSSensors.propTypes = {
  url: PropTypes.string.isRequired,
};

export default WIDSSensors;
