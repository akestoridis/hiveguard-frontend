/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/BatteryPercentages.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TimeLineChart from '../segments/TimeLineChart';

function BatteryPercentages({ inspectionAPI }) {
  const [widsSensorsState, setWIDSSensorsState] = useState([]);
  const [widsSensorIDOptions, setWIDSSensorIDOptions] = useState([]);
  const [panIdentifiersState, setPANIdentifiersState] = useState([]);
  const [panIDOptions, setPANIDOptions] = useState([]);
  const [shortAddressesState, setShortAddressesState] = useState([]);
  const [shortAddressesOptions, setShortAddressesOptions] = useState([]);
  const [selSensorState, setSelSensorState] = useState('');
  const [selIntvlState, setSelIntvlState] = useState('24');
  const [selPANState, setSelPANState] = useState('');
  const [selShortState, setSelShortState] = useState('');
  const [dataURLState, setDataURLState] = useState(null);

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

  useEffect(
    () => {
      fetchWIDSSensors();
      fetchPANIdentifiers();
    },
    [],
  );

  useEffect(
    () => {
      if (widsSensorsState.length === 0) {
        setWIDSSensorIDOptions([]);
        setSelSensorState('');
      } else {
        setWIDSSensorIDOptions(
          Array.from(
            widsSensorsState,
            (row) => (
              <option key={row.wids_sensor_id} value={row.wids_sensor_id}>
                {row.wids_sensor_id}
              </option>
            ),
          ),
        );
        setSelSensorState(widsSensorsState[0].wids_sensor_id);
      }
    },
    [widsSensorsState],
  );

  useEffect(
    () => {
      if (panIdentifiersState.length === 0) {
        setPANIDOptions([]);
        setSelPANState('');
      } else {
        setPANIDOptions(
          Array.from(
            panIdentifiersState,
            (panid) => (
              <option key={panid} value={panid}>
                {panid}
              </option>
            ),
          ),
        );
        setSelPANState(panIdentifiersState[0]);
        fetchShortAddresses(panIdentifiersState[0]);
      }
    },
    [panIdentifiersState],
  );

  useEffect(
    () => {
      if (shortAddressesState.length === 0) {
        setShortAddressesOptions([]);
        setSelShortState('');
      } else {
        setShortAddressesOptions(
          Array.from(
            shortAddressesState,
            (shortaddr) => (
              <option key={shortaddr} value={shortaddr}>
                {shortaddr}
              </option>
            ),
          ),
        );
        setSelShortState(shortAddressesState[0]);
      }
    },
    [shortAddressesState],
  );

  useEffect(
    () => {
      if (
        inspectionAPI
        && selSensorState
        && selIntvlState
        && selPANState
        && selShortState
      ) {
        setDataURLState(
          `${inspectionAPI}/battery-percentages/?sensor=${selSensorState}`
          + `&hours=${selIntvlState}&srcpanid=${selPANState}`
          + `&srcshortaddr=${selShortState}`,
        );
      } else {
        setDataURLState(null);
      }
    },
    [selSensorState, selIntvlState, selPANState, selShortState],
  );

  useEffect(
    () => {
      if (selPANState) {
        fetchShortAddresses(selPANState);
      } else {
        setShortAddressesState([]);
      }
    },
    [selPANState],
  );

  return (
    <Container fluid>
      <div className="p-5 mb-4 rounded-3 bg-light text-dark text-center">
        <h1 className="display-5 fw-bold">Battery Percentages Page</h1>
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
                  <option value="24">1 day</option>
                  <option value="48">2 days</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                  <option value="336">14 days</option>
                  <option value="504">21 days</option>
                  <option value="744">31 days</option>
                  <option value="1488">62 days</option>
                  <option value="2232">93 days</option>
                  <option value="8760">365 days</option>
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
      </div>
      <Container>
        <TimeLineChart
          dataURL={dataURLState}
          dataLabel="Battery Percentage (%) over Time"
          lineColor="rgba(0, 0, 128, 1.0)"
          areaColor="rgba(0, 0, 128, 0.25)"
          yMin={0}
          yMax={100}
        />
        <br />
      </Container>
    </Container>
  );
}

BatteryPercentages.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default BatteryPercentages;
