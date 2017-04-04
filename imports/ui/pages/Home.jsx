import React, { Component } from 'react';
import { Row, Panel, Col, Jumbotron } from 'react-bootstrap';

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
          </Row>
        </Col>
      </Row>
    );
  }
}
