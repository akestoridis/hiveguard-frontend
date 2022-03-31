/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/NotFound.jsx
 * @license Apache-2.0
 */

import React from 'react';
import Container from 'react-bootstrap/Container';

function NotFound() {
  return (
    <Container fluid>
      <div className="p-5 mb-4 rounded-3 bg-light text-dark text-center">
        <h1 className="display-5 fw-bold">Page Not Found</h1>
      </div>
    </Container>
  );
}

export default NotFound;
