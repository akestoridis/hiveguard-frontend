/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Home.jsx
 * @license Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import WIDSSensors from '../segments/WIDSSensors';

function Home({ inspectionAPI }) {
  return (
    <Container>
      <WIDSSensors
        url={`${inspectionAPI}/wids-sensors`}
      />
    </Container>
  );
}

Home.propTypes = {
  inspectionAPI: PropTypes.string.isRequired,
};

export default Home;
