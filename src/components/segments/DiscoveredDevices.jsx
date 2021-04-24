/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/DiscoveredDevices.jsx
 * @license Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';
import { graphviz } from 'd3-graphviz';

const dataEntryStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
};

const graphStyle = {
  display: 'flex',
  justifyContent: 'center',
};

function DiscoveredDevices({ dataURL }) {
  const timeoutRef = useRef(null);
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);
  const [tableRowsState, setTableRowsState] = useState([]);
  const [graphDefState, setGraphDefState] = useState('digraph {}');

  const fetchData = async () => {
    if (!dataURL) {
      setFetchState(
        `Unable to fetch data at ${new Date().toLocaleTimeString()}`,
      );
      return;
    }

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

  const fetchDataPeriodically = () => {
    fetchData();
    timeoutRef.current = setTimeout(fetchDataPeriodically, 30000);
  };

  useEffect(() => {
    if (dataURL) {
      fetchDataPeriodically();
    } else {
      setFetchState(
        `Unable to fetch data at ${new Date().toLocaleTimeString()}`,
      );
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [dataURL]);

  useEffect(() => {
    if (dataState.table) {
      setTableRowsState(Array.from(
        dataState.table,
        (row) => (
          <tr key={row.shortaddr}>
            <td style={dataEntryStyle}>
              {row.shortaddr}
            </td>
            <td style={dataEntryStyle}>
              {row.extendedaddr}
            </td>
            <td style={dataEntryStyle}>
              {row.nwkdevtype}
            </td>
          </tr>
        ),
      ));
    } else {
      setTableRowsState([]);
    }
    if (dataState.graph) {
      setGraphDefState(dataState.graph);
    } else {
      setGraphDefState('digraph {}');
    }
  }, [dataState]);

  useEffect(() => {
    graphviz('#topologyGraph', { useWorker: false }).renderDot(graphDefState);
  }, [graphDefState]);

  return (
    <Container fluid>
      <Row noGutters className="align-items-end">
        <Col xs={8}>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              Discovered Devices
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
                    Short Address
                  </th>
                  <th style={dataEntryStyle}>
                    Extended Address
                  </th>
                  <th style={dataEntryStyle}>
                    Logical Device Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRowsState}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col>
          <div id="topologyGraph" style={graphStyle} />
        </Col>
      </Row>
    </Container>
  );
}

DiscoveredDevices.propTypes = {
  dataURL: PropTypes.string,
};

DiscoveredDevices.defaultProps = {
  dataURL: null,
};

export default DiscoveredDevices;
