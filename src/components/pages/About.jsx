/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/About.jsx
 * @license Apache-2.0
 */

import React from 'react';
import { HashLink } from 'react-router-hash-link';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
// eslint-disable-next-line import/no-unresolved
import metadata from '../metadata.json';

const licenseHeaderStyle = {
  fontWeight: 'bold',
};

const licenseTextStyle = {
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
};

function About() {
  let i;
  let key;
  let pkgLicense;
  let pkgLicenseText;

  const tableRows = [];
  const licenseCards = [];

  for (i = 0; i < Object.keys(metadata.frontendDependencies).length; i += 1) {
    key = Object.keys(metadata.frontendDependencies)[i];
    pkgLicense = metadata.frontendDependencies[key].pkgLicense;
    pkgLicenseText = metadata.frontendDependencies[key].pkgLicenseText;

    tableRows.push(
      <tr key={`${key}-Row`}>
        <td>{key}</td>
        <td>
          <HashLink to={`#${key}`}>
            {pkgLicense}
          </HashLink>
        </td>
      </tr>,
    );

    licenseCards.push(
      <Card key={`${key}-Card`} id={key}>
        <Card.Header style={licenseHeaderStyle}>
          {`License of ${key}`}
        </Card.Header>
        <Card.Body>
          <Card.Text style={licenseTextStyle}>
            {pkgLicenseText}
          </Card.Text>
        </Card.Body>
      </Card>,
    );
  }

  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>About HiveGuard</h1>
        <p>
          HiveGuard is a distributed system for monitoring the security of
          Zigbee networks.
        </p>
      </Jumbotron>
      <Container>
        <h2>
          {`${metadata.frontendName} v${metadata.frontendVersion}`}
        </h2>
        <p>
          Copyright 2021 Dimitrios-Georgios Akestoridis
        </p>
        <p>
          {'License: '}
          <HashLink to={`#${metadata.frontendName}`}>
            {metadata.frontendLicense}
          </HashLink>
          <br />
          {'Repository: '}
          <a
            href={metadata.frontendRepository}
            target="_blank"
            rel="noreferrer"
          >
            {metadata.frontendRepository}
          </a>
        </p>
        <br />
        <h4>Summary of frontend production dependencies</h4>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Package Name and Version</th>
              <th>Package License</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </Table>
        <br />
        <h4 id={metadata.frontendName}>
          {`License of ${metadata.frontendName} v${metadata.frontendVersion}`}
        </h4>
        <Card key="frontendLicense">
          <Card.Body>
            <Card.Text style={licenseTextStyle}>
              {metadata.frontendLicenseText}
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <h4>Licenses of frontend production dependencies</h4>
        {licenseCards}
      </Container>
    </Container>
  );
}

export default About;
