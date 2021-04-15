/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/NavigationBar.jsx
 * @license Apache-2.0
 */

import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../hiveguard-logo.svg';

function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <LinkContainer exact to="/">
        <Navbar.Brand>
          <img
            src={logo}
            width="30"
            height="30"
            alt=""
            className="d-inline-block align-top"
          />
          {' '}
          HiveGuard
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="collapsible-nav" />
      <Navbar.Collapse id="collapsible-nav">
        <Nav className="ml-auto" activeKey="">
          <LinkContainer exact to="/network">
            <Nav.Link>Network</Nav.Link>
          </LinkContainer>
          <LinkContainer exact to="/utilization">
            <Nav.Link>Utilization</Nav.Link>
          </LinkContainer>
          <LinkContainer exact to="/archive">
            <Nav.Link>Archive</Nav.Link>
          </LinkContainer>
          <LinkContainer exact to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
