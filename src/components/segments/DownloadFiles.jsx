/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/DownloadFiles.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise, Download } from 'react-bootstrap-icons';
import { saveAs } from 'file-saver';

const dataEntryStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
};

const actionEntryStyle = {
  textAlign: 'center',
  verticalAlign: 'middle',
  width: '2px',
};

function DownloadFiles({ dataURL }) {
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

  const downloadFile = async (fileName) => {
    try {
      const response = await fetch(`${dataURL}/${fileName}`);
      if (
        response.ok
        && response.headers.get('content-type').includes('application/zip')
      ) {
        saveAs(await response.blob(), fileName);
      } else {
        alert(
          'Unsuccessful downloading of the requested file: '
          + `${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      alert('Failed to download the requested file');
    }
  };

  useEffect(() => {
    if (dataURL) {
      fetchData();
    } else {
      setFetchState(
        `Unable to fetch data at ${new Date().toLocaleTimeString()}`,
      );
    }
  }, [dataURL]);

  useEffect(() => {
    setTableRowsState(Array.from(
      dataState,
      (fileName) => (
        <tr key={fileName}>
          <td style={dataEntryStyle}>
            {fileName}
          </td>
          <td style={actionEntryStyle}>
            <Button variant="primary" onClick={() => downloadFile(fileName)}>
              <Download />
            </Button>
          </td>
        </tr>
      ),
    ));
  }, [dataState]);

  return (
    <Container>
      <Row noGutters className="align-items-end">
        <Col>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              Archived Files
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
                  File Name
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

DownloadFiles.propTypes = {
  dataURL: PropTypes.string,
};

DownloadFiles.defaultProps = {
  dataURL: null,
};

export default DownloadFiles;
