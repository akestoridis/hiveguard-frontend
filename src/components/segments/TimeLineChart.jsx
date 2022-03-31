/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
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
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function TimeLineChart(
  {
    dataURL,
    dataLabel,
    lineColor,
    areaColor,
    yMin,
    yMax,
  },
) {
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

  useEffect(
    () => {
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
    },
    [dataURL],
  );

  useEffect(
    () => {
      const myChart = new Chart(
        canvasRef.current,
        {
          type: 'line',
          data: {
            datasets: [
              {
                data: dataState,
                fill: 'origin',
                borderColor: lineColor,
                backgroundColor: areaColor,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
            },
            elements: {
              line: {
                tension: 0,
              },
              point: {
                radius: 2,
              },
            },
            animation: {
              duration: 0,
            },
            scales: {
              x: {
                type: 'time',
                ticks: {
                  maxTicksLimit: 20,
                  color: 'rgba(0, 0, 0, 1.0)',
                },
              },
              y: {
                suggestedMin: yMin,
                suggestedMax: yMax,
                ticks: {
                  color: 'rgba(0, 0, 0, 1.0)',
                },
              },
            },
          },
        },
      );
      return () => {
        myChart.destroy();
      };
    },
    [dataState],
  );

  return (
    <Container fluid>
      <Row className="align-items-end">
        <Col xs={7}>
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
      <Row className="align-items-start">
        <Col>
          <canvas ref={canvasRef} />
        </Col>
      </Row>
    </Container>
  );
}

TimeLineChart.propTypes = {
  dataURL: PropTypes.string,
  dataLabel: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  areaColor: PropTypes.string.isRequired,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
};

TimeLineChart.defaultProps = {
  dataURL: null,
  yMin: null,
  yMax: null,
};

export default TimeLineChart;
