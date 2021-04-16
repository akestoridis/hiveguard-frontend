/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/NotFound.jsx
 * @license Apache-2.0
 */

import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

function NotFound() {
  return (
    <Container fluid>
      <Jumbotron align="center">
        <h1>Page Not Found</h1>
      </Jumbotron>
    </Container>
  );
}

export default NotFound;
