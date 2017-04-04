import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import {
  Row,
  Col,
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { SuccessfulTrades } from '../../api/successfulTrades.js';

class MySuccessfulTrades extends Component {
  render() {
    if (!Meteor.userId()) return <PageHeader>Please login</PageHeader>;

    const trades = this.props.successfulTrades;

    return (
      <Row>
        <Col>
          <PageHeader>My Successful Trades</PageHeader>
        </Col>
        <Col>
          {trades.length == 0 &&
            <p>
              You have no trades! Why not
              {' '}
              <Link to="/mybooks">add a book</Link>
              {' '}
              and then
              {' '}
              <Link to="/allbooks">propose a trade</Link>
            </p>}
          <ListGroup>
            {trades.map(trade => (
              <ListGroupItem key={trade._id}>
                <strong>{trade.ownerBookTitle}</strong>
                {' '}
                <em>traded for</em>
                {' '}
                <strong>{trade.traderBookTitle}</strong>
                {' '}
                <em>with</em>
                {' '}
                {trade.traderUsername} {moment(trade.createdAt).fromNow()}

              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

MySuccessfulTrades.propTypes = {
  successfulTrades: PropTypes.array.isRequired,
};

export default createContainer(
  () => {
    Meteor.subscribe('successfulTrades');

    return {
      successfulTrades: SuccessfulTrades.find(
        { owner: Meteor.userId() },
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      currentUser: Meteor.user(),
    };
  },
  MySuccessfulTrades,
);
