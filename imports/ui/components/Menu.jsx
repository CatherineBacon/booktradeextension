import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Nav, NavItem, Navbar, Row, Col, Modal, Button } from 'react-bootstrap';

import CustomLogin from './CustomLogin.jsx';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.handleSelect = this._handleSelect.bind(this);
    this.openModal = this._openModal.bind(this);
    this.closeModal = this._closeModal.bind(this);
    this.handleLogInOut = this._handleLogInOut.bind(this);
  }

  _handleSelect(eventKey, event) {
    event.preventDefault();

    const routes = [
      '/',
      '/mybooks',
      '/mysuccessfultrades',
      '/allbooks',
      '/profile',
    ];

    this.props.history.push(routes[eventKey]);
  }

  _handleLogInOut() {
    if (this.props.currentUser) return Meteor.logout();
    this.openModal();
  }

  _openModal() {
    this.setState({ showModal: true });
  }

  _closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <Row>
        <Col>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>Book Exchange!</Navbar.Brand>
            </Navbar.Header>
            <Nav onSelect={this.handleSelect} pullRight>
              <NavItem eventKey={0} href="#">Home</NavItem>
              <NavItem eventKey={1} href="#">My Books</NavItem>
              <NavItem eventKey={2} href="#">
                My Successful Trades
              </NavItem>
              <NavItem eventKey={3} href="#">All Books</NavItem>
              <NavItem eventKey={4} href="#">Profile</NavItem>
              <NavItem onClick={this.handleLogInOut}>
                {this.props.currentUser ? 'Log out' : 'Log in'}
              </NavItem>

            </Nav>
          </Navbar>
        </Col>

        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.currentUser ? 'Log out' : 'Log in'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body><CustomLogin /></Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Row>
    );
  }
}

Menu.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};
