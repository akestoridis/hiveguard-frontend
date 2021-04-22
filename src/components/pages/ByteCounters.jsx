/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/ByteCounters.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TimeBarChart from '../segments/TimeBarChart';

function ByteCounters({ inspectionAPI }) {
  const [widsSensorsState, setWIDSSensorsState] = useState([]);
  const [widsSensorIDOptions, setWIDSSensorIDOptions] = useState([]);
  const [panIdentifiersState, setPANIdentifiersState] = useState([]);
  const [panIDOptions, setPANIDOptions] = useState([]);
  const [shortAddressesState, setShortAddressesState] = useState([]);
  const [shortAddressesOptions, setShortAddressesOptions] = useState([]);
  const [selSensorState, setSelSensorState] = useState('');
  const [selIntvlState, setSelIntvlState] = useState('1');
  const [selPANState, setSelPANState] = useState('');
  const [selShortState, setSelShortState] = useState('');
  const [panURLState, setPANURLState] = useState(null);
  const [deviceURLState, setDeviceURLState] = useState(null);

  const fetchWIDSSensors = async () => {
    try {
      const response = await fetch(`${inspectionAPI}/wids-sensors`);
      if (
        response.ok
        && response.headers.get('content-type').includes('application/json')
      ) {
        setWIDSSensorsState(await response.json());
      } else {
        setWIDSSensorsState([]);
      }
    } catch (err) {
      setWIDSSensorsState([]);
    }
  };

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

  const fetchShortAddresses = async (panid) => {
    try {
      const response = await fetch(
        `${inspectionAPI}/short-addresses?panid=${panid}`,
      );
      if (
        response.ok
        && response.headers.get('content-type').includes('application/json')
      ) {
        setShortAddressesState(await response.json());
      } else {
        setShortAddressesState([]);
      }
    } catch (err) {
      setShortAddressesState([]);
    }
  };

  useEffect(() => {
    fetchWIDSSensors();
    fetchPANIdentifiers();
  }, []);

  useEffect(() => {
    if (widsSensorsState.length === 0) {
      setWIDSSensorIDOptions([]);
      setSelSensorState('');
    } else {
      setWIDSSensorIDOptions(Array.from(
        widsSensorsState,
        (row) => (
          <option key={row.wids_sensor_id} value={row.wids_sensor_id}>
            {row.wids_sensor_id}
          </option>
        ),
      ));
      setSelSensorState(widsSensorsState[0].wids_sensor_id);
    }
  }, [widsSensorsState]);

  useEffect(() => {
    if (panIdentifiersState.length === 0) {
      setPANIDOptions([]);
      setSelPANState('');
    } else {
      setPANIDOptions(Array.from(
        panIdentifiersState,
        (panid) => (
          <option key={panid} value={panid}>
            {panid}
          </option>
        ),
      ));
      setSelPANState(panIdentifiersState[0]);
      fetchShortAddresses(panIdentifiersState[0]);
    }
  }, [panIdentifiersState]);

  useEffect(() => {
    if (shortAddressesState.length === 0) {
      setShortAddressesOptions([]);
      setSelShortState('');
    } else {
      setShortAddressesOptions(Array.from(
        shortAddressesState,
        (shortaddr) => (
          <option key={shortaddr} value={shortaddr}>
            {shortaddr}
          </option>
        ),
      ));
      setSelShortState(shortAddressesState[0]);
    }
  }, [shortAddressesState]);

  useEffect(() => {
    if (inspectionAPI && selSensorState && selIntvlState && selPANState) {
      setPANURLState(
        `${inspectionAPI}/byte-counters/?sensor=${selSensorState}`
        + `&hours=${selIntvlState}&srcpanid=${selPANState}`,
      );
      if (selShortState) {
        setDeviceURLState(
          `${inspectionAPI}/byte-counters/?sensor=${selSensorState}`
          + `&hours=${selIntvlState}&srcpanid=${selPANState}`
          + `&srcshortaddr=${selShortState}`,
        );
      } else {
        setDeviceURLState(null);
      }
    } else {
      setPANURLState(null);
      setDeviceURLState(null);
    }
  }, [selSensorState, selIntvlState, selPANState, selShortState]);

  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Byte Counters Page</h1>
        <br />
        <Container>
          <Row
            className="row-cols-1 row-cols-md-2"
            style={{ fontSize: 'x-large' }}
          >
            <Col>
              <label htmlFor="wids_sensor_id_options">
                <b>
                  WIDS Sensor ID:
                </b>
                {' '}
                <select
                  id="wids_sensor_id_options"
                  value={selSensorState}
                  onChange={(event) => setSelSensorState(event.target.value)}
                >
                  {widsSensorIDOptions}
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
            <Col>
              <label htmlFor="pan_id_options">
                <b>
                  Source PAN ID:
                </b>
                {' '}
                <select
                  id="pan_id_options"
                  value={selPANState}
                  onChange={(event) => setSelPANState(event.target.value)}
                >
                  {panIDOptions}
                </select>
              </label>
            </Col>
            <Col>
              <label htmlFor="short_address_options">
                <b>
                  Source Address:
                </b>
                {' '}
                <select
                  id="short_address_options"
                  value={selShortState}
                  onChange={(event) => setSelShortState(event.target.value)}
                >
                  {shortAddressesOptions}
                </select>
              </label>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Row className="row-cols-1 row-cols-lg-2">
        <Col>
          <TimeBarChart
            dataURL={panURLState}
            dataLabel="New PAN Bytes over Time"
            lineColor="rgba(0, 0, 128, 1.0)"
            areaColor="rgba(0, 0, 128, 0.5)"
            yMin={0}
            yMax={500}
          />
          <br />
        </Col>
        <Col>
          <TimeBarChart
            dataURL={deviceURLState}
            dataLabel="New Device Bytes over Time"
            lineColor="rgba(0, 128, 0, 1.0)"
            areaColor="rgba(0, 128, 0, 0.5)"
            yMin={0}
            yMax={500}
          />
          <br />
        </Col>
      </Row>
    </Container>
  );
}

ByteCounters.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default ByteCounters;
