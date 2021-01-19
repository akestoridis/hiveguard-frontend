/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Utilization.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LineChart from '../segments/LineChart';

function Utilization({ inspectionAPI }) {
  const [widsSensorsState, setWIDSSensorsState] = useState([]);
  const [widsSensorIDOptions, setWIDSSensorOptions] = useState([]);
  const [selectIDState, setSelectIDState] = useState('');
  const [selectIntervalState, setSelectIntervalState] = useState('1');
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

  useEffect(() => {
    fetchWIDSSensors();
  }, []);

  useEffect(() => {
    if (widsSensorsState.length === 0) {
      setWIDSSensorOptions([]);
      setSelectIDState('');
    } else {
      setWIDSSensorOptions(Array.from(
        widsSensorsState,
        (row) => (
          <option key={row.wids_sensor_id} value={row.wids_sensor_id}>
            {row.wids_sensor_id}
          </option>
        ),
      ));
      setSelectIDState(widsSensorsState[0].wids_sensor_id);
    }
  }, [widsSensorsState]);

  useEffect(() => {
    if (inspectionAPI && selectIDState && selectIntervalState) {
      setCPUURLState(
        `${inspectionAPI}/wids-sensors/${selectIDState}/cpu`
        + `?hours=${selectIntervalState}`,
      );
      setMemoryURLState(
        `${inspectionAPI}/wids-sensors/${selectIDState}/memory`
        + `?hours=${selectIntervalState}`,
      );
      setDiskURLState(
        `${inspectionAPI}/wids-sensors/${selectIDState}/disk`
        + `?hours=${selectIntervalState}`,
      );
    } else {
      setCPUURLState(null);
      setMemoryURLState(null);
      setDiskURLState(null);
    }
  }, [selectIDState, selectIntervalState]);

  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Utilization Page</h1>
        <br />
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
                  value={selectIDState}
                  onChange={(event) => setSelectIDState(event.target.value)}
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
                  value={selectIntervalState}
                  onChange={(event) => setSelectIntervalState(event.target.value)}
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
      </Jumbotron>
      <Row>
        <Col>
          <LineChart
            dataURL={cpuURLState}
            yLabel="CPU usage (%)"
            lineColor="rgba(0, 0, 128, 1.0)"
            areaColor="rgba(0, 0, 128, 0.25)"
          />
        </Col>
        <Col>
          <LineChart
            dataURL={memoryURLState}
            yLabel="Memory usage (%)"
            lineColor="rgba(0, 128, 0, 1.0)"
            areaColor="rgba(0, 128, 0, 0.25)"
          />
        </Col>
        <Col>
          <LineChart
            dataURL={diskURLState}
            yLabel="Disk usage (%)"
            lineColor="rgba(128, 0, 0, 1.0)"
            areaColor="rgba(128, 0, 0, 0.25)"
          />
        </Col>
      </Row>
    </Container>
  );
}

Utilization.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default Utilization;
