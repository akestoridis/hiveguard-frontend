/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/NavigationBar.jsx
 * @license Apache-2.0
 */

import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../hiveguard-logo.svg';

const dropdownStyle = {
  display: 'block',
  width: '100%',
  clear: 'both',
  padding: '0.5rem 1rem',
  whiteSpace: 'nowrap',
  textAlign: 'inherit',
  fontWeight: 'normal',
  backgroundColor: '#ffffff',
  color: '#000000',
};

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
          <NavDropdown title="Inspection">
            <LinkContainer
              exact
              to="/utilization"
              style={dropdownStyle}
            >
              <Nav.Link>Utilization</Nav.Link>
            </LinkContainer>
            <LinkContainer
              exact
              to="/network"
              style={dropdownStyle}
            >
              <Nav.Link>Network</Nav.Link>
            </LinkContainer>
            <LinkContainer
              exact
              to="/packet-counters"
              style={dropdownStyle}
            >
              <Nav.Link>Packet Counters</Nav.Link>
            </LinkContainer>
            <LinkContainer
              exact
              to="/byte-counters"
              style={dropdownStyle}
            >
              <Nav.Link>Byte Counters</Nav.Link>
            </LinkContainer>
            <LinkContainer
              exact
              to="/header-fields"
              style={dropdownStyle}
            >
              <Nav.Link>Header Fields</Nav.Link>
            </LinkContainer>
            <LinkContainer
              exact
              to="/battery-percentages"
              style={dropdownStyle}
            >
              <Nav.Link>Battery Percentages</Nav.Link>
            </LinkContainer>
          </NavDropdown>
          <LinkContainer
            exact
            to="/archive"
          >
            <Nav.Link>Archive</Nav.Link>
          </LinkContainer>
          <LinkContainer
            exact
            to="/about"
          >
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
