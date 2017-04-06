import React, { Component } from 'react';
import { Row, Panel, Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              <Jumbotron>
                <h1>Welcome to Book Exchange!</h1>
              </Jumbotron>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Panel>Catalogue your books online</Panel>
            </Col>
            <Col sm={6}>
              <Panel>See all of the books our users own</Panel>
            </Col>
            <Col sm={6}>
              <Panel>
                Request to borrow other users books
              </Panel>
            </Col>
            <Col sm={6}>
              <Panel>
                Manage trades with users from all over the world
              </Panel>
            </Col>
            <Col sm={12}>
              <Panel>
                Check out
                {' '}
                <Link to="/allbooks">all our books</Link>
                {' '}
                to see what's available and
                {' '}
                <Link to="/profile">log in</Link>
                {' '}
                to start trading
              </Panel>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
