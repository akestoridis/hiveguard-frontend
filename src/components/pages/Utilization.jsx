/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Utilization.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TimeLineChart from '../segments/TimeLineChart';

function Utilization({ inspectionAPI }) {
  const [widsSensorsState, setWIDSSensorsState] = useState([]);
  const [widsSensorIDOptions, setWIDSSensorIDOptions] = useState([]);
  const [selSensorState, setSelSensorState] = useState('');
  const [selIntvlState, setSelIntvlState] = useState('1');
  const [cpuURLState, setCPUURLState] = useState(null);
  const [memoryURLState, setMemoryURLState] = useState(null);
  const [diskURLState, setDiskURLState] = useState(null);

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

  useEffect(
    () => {
      fetchWIDSSensors();
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
      if (inspectionAPI && selSensorState && selIntvlState) {
        setCPUURLState(
          `${inspectionAPI}/wids-sensors/${selSensorState}/cpu`
          + `?hours=${selIntvlState}`,
        );
        setMemoryURLState(
          `${inspectionAPI}/wids-sensors/${selSensorState}/memory`
          + `?hours=${selIntvlState}`,
        );
        setDiskURLState(
          `${inspectionAPI}/wids-sensors/${selSensorState}/disk`
          + `?hours=${selIntvlState}`,
        );
      } else {
        setCPUURLState(null);
        setMemoryURLState(null);
        setDiskURLState(null);
      }
    },
    [selSensorState, selIntvlState],
  );

  return (
    <Container fluid>
      <div className="p-5 mb-4 rounded-3 bg-light text-dark text-center">
        <h1 className="display-5 fw-bold">Utilization Page</h1>
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
          </Row>
        </Container>
      </div>
      <Row className="row-cols-1 row-cols-lg-3">
        <Col>
          <TimeLineChart
            dataURL={cpuURLState}
            dataLabel="CPU Usage (%) over Time"
            lineColor="rgba(0, 0, 128, 1.0)"
            areaColor="rgba(0, 0, 128, 0.25)"
            yMin={0}
            yMax={100}
          />
          <br />
        </Col>
        <Col>
          <TimeLineChart
            dataURL={memoryURLState}
            dataLabel="Memory Usage (%) over Time"
            lineColor="rgba(0, 128, 0, 1.0)"
            areaColor="rgba(0, 128, 0, 0.25)"
            yMin={0}
            yMax={100}
          />
          <br />
        </Col>
        <Col>
          <TimeLineChart
            dataURL={diskURLState}
            dataLabel="Disk Usage (%) over Time"
            lineColor="rgba(128, 0, 0, 1.0)"
            areaColor="rgba(128, 0, 0, 0.25)"
            yMin={0}
            yMax={100}
          />
          <br />
        </Col>
      </Row>
    </Container>
  );
}

Utilization.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default Utilization;
