/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/TimeBarChart.jsx
 * @license Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ArrowClockwise } from 'react-bootstrap-icons';
import Chart from 'chart.js';

function TimeBarChart({
  dataURL,
  dataLabel,
  lineColor,
  areaColor,
  yMin,
  yMax,
}) {
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);
  const [fetchState, setFetchState] = useState('Fetching data...');
  const [dataState, setDataState] = useState([]);

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
    const myScales = {
      xAxes: [{
        type: 'time',
        ticks: {
          maxTicksLimit: 20,
        },
      }],
    };
    if (yMin !== null && yMax !== null) {
      myScales.yAxes = [{
        ticks: {
          suggestedMin: yMin,
          suggestedMax: yMax,
        },
      }];
    }
    /* eslint-disable no-unused-vars */
    const myChart = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        datasets: [{
          data: dataState,
          borderWidth: 4,
          borderColor: lineColor,
          backgroundColor: areaColor,
        }],
      },
      options: {
        legend: {
          display: false,
        },
        animation: {
          duration: 0,
        },
        scales: myScales,
      },
    });
    /* eslint-enable no-unused-vars */
  }, [dataState]);

  return (
    <Container fluid>
      <Row noGutters className="align-items-end">
        <Col xs={8}>
          <p style={{ textAlign: 'left' }}>
            <b style={{ verticalAlign: 'bottom', fontSize: 'x-large' }}>
              {dataLabel}
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
        <canvas ref={canvasRef} />
      </Row>
    </Container>
  );
}

TimeBarChart.propTypes = {
  dataURL: PropTypes.string,
  dataLabel: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  areaColor: PropTypes.string.isRequired,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
};

TimeBarChart.defaultProps = {
  dataURL: null,
  yMin: null,
  yMax: null,
};

export default TimeBarChart;
