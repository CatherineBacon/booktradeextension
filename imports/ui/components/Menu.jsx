import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Nav, NavItem, Navbar, Row, Col, Modal, Button } from 'react-bootstrap';

import CustomLogin from './CustomLogin.jsx';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this._handleSelect.bind(this);
    this.handleLogOut = this._handleLogOut.bind(this);
  }

  _handleSelect(eventKey, event) {
    event.preventDefault();

    const routes = [
      '/',
      '/allbooks',
      '/mybooks',
      '/mysuccessfultrades',
      '/profile',
    ];

    this.props.history.push(routes[eventKey]);
  }

  _handleLogOut() {
    if (this.props.currentUser) return Meteor.logout();
  }

  render() {
    if (this.props.currentUser) {
      return (
        <Row>
          <Col>
            <Navbar inverse>
              <Navbar.Header>
                <Navbar.Brand>Book Exchange!</Navbar.Brand>
              </Navbar.Header>
              <Nav onSelect={this.handleSelect} pullRight>
                <NavItem eventKey={0} href="#">Home</NavItem>
                <NavItem eventKey={1} href="#">All Books</NavItem>
                <NavItem eventKey={2} href="#">My Books</NavItem>
                <NavItem eventKey={3} href="#">
                  My Successful Trades
                </NavItem>
                <NavItem eventKey={4} href="#">Profile</NavItem>
                <NavItem onClick={this.handleLogOut}>
                  Log out
                </NavItem>
              </Nav>
            </Navbar>
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <Col>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>Book Exchange!</Navbar.Brand>
            </Navbar.Header>
            <Nav onSelect={this.handleSelect} pullRight>
              <NavItem eventKey={0} href="#">Home</NavItem>
              <NavItem eventKey={1} href="#">All Books</NavItem>
              <NavItem eventKey={4} href="#">Log in</NavItem>
            </Nav>
          </Navbar>
        </Col>
      </Row>
    );
  }
}

Menu.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};
