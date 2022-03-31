/*!
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/segments/NavigationBar.jsx
 * @license Apache-2.0
 */

import React from 'react';
import Container from 'react-bootstrap/Container';
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
      <Container fluid>
        <LinkContainer to="/">
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
        <Navbar.Collapse id="collapsible-nav" className="justify-content-end">
          <Nav className="ml-auto" activeKey="">
            <NavDropdown title="Inspection">
              <LinkContainer to="/utilization" style={dropdownStyle}>
                <Nav.Link>Utilization</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/topology" style={dropdownStyle}>
                <Nav.Link>Topology</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/packet-counters" style={dropdownStyle}>
                <Nav.Link>Packet Counters</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/byte-counters" style={dropdownStyle}>
                <Nav.Link>Byte Counters</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/header-fields" style={dropdownStyle}>
                <Nav.Link>Header Fields</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/battery-percentages" style={dropdownStyle}>
                <Nav.Link>Battery Percentages</Nav.Link>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/archive">
              <Nav.Link>Archive</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
