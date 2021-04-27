/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/WIDSSensors.jsx
 * @license Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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

const labelStyle = {
  display: 'inline-block',
  width: '256px',
};

function WIDSSensors({ dataURL, registryURL }) {
  const timeoutRef = useRef(null);
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);
  const [tableRowsState, setTableRowsState] = useState([]);
  const [regModalState, setRegModalState] = useState(false);
  const [regIDState, setRegIDState] = useState('');
  const [regAPIState, setRegAPIState] = useState('');
  const [deregModalState, setDeregModalState] = useState(false);
  const [deregIDState, setDeregIDState] = useState('');

  const closeRegModal = () => {
    setRegModalState(false);
    setRegIDState('');
    setRegAPIState('');
  };

  const closeDeregModal = () => {
    setDeregModalState(false);
    setDeregIDState('');
  };

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

  const registerWIDSSensor = async (payload) => {
    try {
      const response = await fetch(
        registryURL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      if (response.ok) {
        alert(
          'Successful WIDS sensor registration: '
          + `${response.status} ${response.statusText}`,
        );
      } else {
        alert(
          'Unsuccessful WIDS sensor registration: '
          + `${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      alert('Failed to process the WIDS sensor registration request');
    } finally {
      fetchData();
    }
  };

  const deregisterWIDSSensor = async (id) => {
    try {
      const response = await fetch(
        `${registryURL}/${id}`,
        {
          method: 'DELETE',
        },
      );
      if (response.ok) {
        alert(
          'Successful WIDS sensor deregistration: '
          + `${response.status} ${response.statusText}`,
        );
      } else {
        alert(
          'Unsuccessful WIDS sensor deregistration: '
          + `${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      alert('Failed to process the WIDS sensor deregistration request');
    } finally {
      fetchData();
    }
  };

  const handleRegSubmission = (event) => {
    registerWIDSSensor({
      wids_sensor_id: regIDState,
      wids_sensor_api: regAPIState,
    });
    closeRegModal();
    event.preventDefault();
  };

  const confirmDeregRequest = (row) => {
    setDeregIDState(row.wids_sensor_id);
    setDeregModalState(true);
  };

  const handleDeregRequest = () => {
    deregisterWIDSSensor(deregIDState);
    closeDeregModal();
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
            <Button variant="danger" onClick={() => confirmDeregRequest(row)}>
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
        <Col xs={7}>
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
                  <Button
                    variant="primary"
                    onClick={() => setRegModalState(true)}
                  >
                    <PlusCircleFill />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal
        show={regModalState}
        onHide={closeRegModal}
        backdrop="static"
        animation={false}
        aria-labelledby="registration-modal-title"
      >
        <form onSubmit={handleRegSubmission}>
          <Modal.Header closeButton>
            <Modal.Title id="registration-modal-title">
              WIDS Sensor Registration
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <label htmlFor="wids_sensor_id" style={labelStyle}>
                WIDS Sensor ID:
                <input
                  id="wids_sensor_id"
                  type="text"
                  required
                  value={regIDState}
                  onChange={(event) => setRegIDState(event.target.value)}
                />
              </label>
            </p>
            <p>
              <label htmlFor="wids_sensor_api" style={labelStyle}>
                WIDS Sensor API:
                <input
                  id="wids_sensor_api"
                  type="url"
                  required
                  value={regAPIState}
                  onChange={(event) => setRegAPIState(event.target.value)}
                />
              </label>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">Submit</Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal
        show={deregModalState}
        onHide={closeDeregModal}
        backdrop="static"
        animation={false}
        aria-labelledby="deregistration-modal-title"
      >
        <Modal.Header>
          <Modal.Title id="deregistration-modal-title">
            WIDS Sensor Deregistration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure that you want to deregister the WIDS sensor
            with the following ID?
          </p>
          <p style={{ textAlign: 'center' }}>
            <b style={{ fontSize: 'x-large' }}>
              {deregIDState}
            </b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeregModal}>No</Button>
          <Button variant="danger" onClick={handleDeregRequest}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

WIDSSensors.propTypes = {
  dataURL: PropTypes.string.isRequired,
  registryURL: PropTypes.string.isRequired,
};

export default WIDSSensors;
