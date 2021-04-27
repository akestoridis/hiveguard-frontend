/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/ArchivedFiles.jsx
 * @license Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
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

function ArchivedFiles({ dataURL }) {
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

  const downloadFile = async (folderName, fileName) => {
    try {
      const response = await fetch(`${dataURL}/${folderName}/${fileName}`);
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
        <tr key={`${row.folderName}/${row.fileName}`}>
          <td style={dataEntryStyle}>
            {row.folderName}
          </td>
          <td style={dataEntryStyle}>
            {row.fileName}
          </td>
          <td style={actionEntryStyle}>
            <Button
              variant="primary"
              onClick={() => downloadFile(row.folderName, row.fileName)}
            >
              <Download />
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
                  Folder Name
                </th>
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

ArchivedFiles.propTypes = {
  dataURL: PropTypes.string,
};

ArchivedFiles.defaultProps = {
  dataURL: null,
};

export default ArchivedFiles;
