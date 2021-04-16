/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/TimeLineChart.jsx
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

function TimeLineChart({
  dataURL,
  dataLabel,
  lineColor,
  areaColor,
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
    /* eslint-disable no-unused-vars */
    const myChart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        datasets: [{
          data: dataState,
          label: dataLabel,
          borderColor: lineColor,
          backgroundColor: areaColor,
        }],
      },
      options: {
        legend: {
          display: false,
        },
        elements: {
          line: {
            tension: 0,
          },
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            ticks: {
              maxTicksLimit: 20,
            },
          }],
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100,
            },
          }],
        },
        animation: {
          duration: 0,
        },
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

TimeLineChart.propTypes = {
  dataURL: PropTypes.string,
  dataLabel: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  areaColor: PropTypes.string.isRequired,
};

TimeLineChart.defaultProps = {
  dataURL: null,
};

export default TimeLineChart;