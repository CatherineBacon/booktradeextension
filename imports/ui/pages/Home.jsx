import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { Badge, Row, Panel, Col, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    const { bookCount } = this.props;
      
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
            <Col sm={12}>
              <Panel>
                A peer to peer book swapping site. Post books direct to other users!
              </Panel>
            </Col>
            <Col sm={6}>
              <Panel>Catalogue your books online</Panel>
            </Col>
            <Col sm={6}>
              <Panel>See all <Badge>{ bookCount }</Badge> books our users have to trade</Panel>
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

Home.propTypes = {
  bookCount: React.PropTypes.number
};

const bookCount = new ReactiveVar(0);

export default createContainer( () => {
  Meteor.call('books.countAll', (err, res) => bookCount.set(res));
  return {
    bookCount: bookCount.get()
  };
}, Home);