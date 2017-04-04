import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import {
  Grid,
  Row,
  Col,
  Clearfix,
  PageHeader,
  Checkbox,
  Badge,
} from 'react-bootstrap';

import { Books } from '../../api/books.js';

import Book from '../components/Book.jsx';
import BookGrid from '../components/BookGrid.jsx';

class AllBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTradeProposed: false,
      hideMyBooks: true,
    };
  }

  toggleHideTradeProposed() {
    this.setState({
      hideTradeProposed: !this.state.hideTradeProposed,
    });
  }

  toggleHideMyBooks() {
    this.setState({
      hideMyBooks: !this.state.hideMyBooks,
    });
  }

  renderBooks() {
    let filteredBooks = this.props.books;
    if (this.state.hideTradeProposed) {
      filteredBooks = filteredBooks.filter(book => !book.tradeProposed);
    }
    if (this.state.hideMyBooks) {
      filteredBooks = filteredBooks.filter(
        book => book.owner != Meteor.userId(),
      );
    }

    return <BookGrid books={filteredBooks} page="AllBooks" />;
  }

  render() {
    if (this.props.currentUser) {
      return (
        <Row>
          <Col>
            <PageHeader>All Books</PageHeader>
          </Col>

          <Col xs={12}>
            <span className="pull-right">
              Books available to trade:
              {' '}
              <Badge>{this.props.availableToTradeCount}</Badge>
            </span>
          </Col>
          <Col>
            <Checkbox
              className="hide-tradeProposed"
              type="checkbox"
              readOnly
              checked={this.state.hideTradeProposed}
              onClick={this.toggleHideTradeProposed.bind(this)}
            >
              Hide books where trade has been proposed
            </Checkbox>
          </Col>

          <Col>
            <Checkbox
              className="hide-myBooks"
              readOnly
              checked={this.state.hideMyBooks}
              onClick={this.toggleHideMyBooks.bind(this)}
            >
              Hide my own books
            </Checkbox>
          </Col>

          <Col>
            <h3>Check the box to propose a trade</h3>
          </Col>

          <Col>
            <Row>
              {this.renderBooks()}
            </Row>
          </Col>
        </Row>
      );
    } else {
      return <PageHeader>Please login</PageHeader>;
    }
  }
}

AllBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
};

export default createContainer(
  () => {
    Meteor.subscribe('books');

    return {
      books: Books.find(
        {},
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      availableToTradeCount: Books.find({
        tradeProposed: { $ne: true },
        owner: { $ne: Meteor.userId() },
      }).count(),
      currentUser: Meteor.user(),
    };
  },
  AllBooks,
);
