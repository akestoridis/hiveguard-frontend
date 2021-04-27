/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/UnreadAlerts.jsx
 * @license Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise, Archive } from 'react-bootstrap-icons';

const dataEntryStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
};

const actionEntryStyle = {
  textAlign: 'center',
  verticalAlign: 'middle',
  width: '2px',
};

function UnreadAlerts({ dataURL }) {
  const timeoutRef = useRef(null);
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);
  const [tableRowsState, setTableRowsState] = useState([]);

  const fetchData = async () => {
    if (!dataURL) {
      setFetchState(
        `Unable to fetch data at ${new Date().toLocaleTimeString()}`,
      );
      return;
    }

    try {
      const response = await fetch(`${dataURL}?archived=false`);
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

  const archiveAlert = async (alertID) => {
    try {
      const response = await fetch(
        `${dataURL}/${alertID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            archived: true,
          }),
        },
      );
      if (response.ok) {
        alert(
          `Successful archiving of the ${alertID} alert: `
          + `${response.status} ${response.statusText}`,
        );
      } else {
        alert(
          `Unsuccessful archiving of the ${alertID} alert: `
          + `${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      alert(`Failed to process the archive request for the ${alertID} alert`);
    } finally {
      fetchData();
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
    setTableRowsState(Array.from(
      dataState,
      (unreadAlert) => (
        <tr key={unreadAlert.alert_id}>
          <td style={dataEntryStyle}>
            {unreadAlert.alert_id}
          </td>
          <td style={dataEntryStyle}>
            {unreadAlert.message}
          </td>
          <td style={actionEntryStyle}>
            <Button
              variant="primary"
              onClick={() => archiveAlert(unreadAlert.alert_id)}
            >
              <Archive />
            </Button>
          </td>
        </tr>
      ),
    ));
  }, [dataState]);

  return (
    <Container>
      <Row noGutters className="align-items-end">
        <Col xs={7}>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              Unread Alerts
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
                  Alert ID
                </th>
                <th style={dataEntryStyle}>
                  Message
                </th>
                <th style={actionEntryStyle}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRowsState}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

UnreadAlerts.propTypes = {
  dataURL: PropTypes.string,
};

UnreadAlerts.defaultProps = {
  dataURL: null,
};

export default UnreadAlerts;
