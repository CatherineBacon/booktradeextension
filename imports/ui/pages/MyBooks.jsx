import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Row,
  Col,
  Clearfix,
  PageHeader,
  Badge,
  Media,
  Checkbox,
} from 'react-bootstrap';

import { Books } from '../../api/books.js';

import Book from '../components/Book.jsx';
import Trader from '../components/Trader.jsx';
import AddBook from '../components/AddBook.jsx';

class MyBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyShowProposed: false,
    };
  }

  toggleOnlyShowProposed() {
    this.setState({
      onlyShowProposed: !this.state.onlyShowProposed,
    });
  }

  renderYourRequests() {
    let books = this.props.books;
    let filteredBooks = books.filter(
      book => book.proposedById == Meteor.userId(),
    );
    let bookComponents = [];

    filteredBooks.forEach((book, i) => {
      bookComponents.push(
        <Col sm={4} key={book._id} className="clearfix">
          <Book book={book} page="AllBooks" />
        </Col>,
      );

      if ((i + 1) % 3 == 0) {
        bookComponents.push(<Clearfix key={i} />);
      }
    });

    return bookComponents;
  }

  renderTradeRequests() {
    let books = this.props.books;
    let filteredBooks = books.filter(
      book => book.owner == Meteor.userId() && book.tradeProposed,
    );

    return filteredBooks.map(book => {
      let traderBooks = books.filter(b => book.proposedById == b.owner);

      return (
        <Media key={book._id}>
          <Media.Left>
            <img width={64} height={63} src={book.image} alt="Image" />
          </Media.Left>
          <Media.Body>
            <Media.Heading>{book.title}</Media.Heading>
            <p>Trade proposed by {book.proposedByUsername}</p>
            <Trader book={book} traderBooks={traderBooks} />
          </Media.Body>
        </Media>
      );
    });
  }

  renderBooks() {
    let books = this.props.books;
    let filteredBooks = books.filter(book => book.owner == Meteor.userId());

    if (this.state.onlyShowProposed) {
      filteredBooks = filteredBooks.filter(book => book.tradeProposed);
    }

    let bookComponents = [];

    filteredBooks.forEach((book, i) => {
      bookComponents.push(
        <Col sm={4} key={book._id} className="clearfix">
          <Book book={book} page="AllBooks" />
        </Col>,
      );

      if ((i + 1) % 3 == 0) {
        bookComponents.push(<Clearfix key={i} />);
      }
    });

    return bookComponents;
  }

  render() {
    Meteor.subscribe('books');
    if (this.props.currentUser) {
      return (
        <Row>
          <Col>
            <PageHeader>My Books</PageHeader>
          </Col>

          <Col>
            <h3>Add book</h3>
            <AddBook />
          </Col>

          <Col>
            <h3>
              Your trade requests
              {' '}
              <Badge>{this.props.youProposedTradeCount}</Badge>
            </h3>
            <Row>{this.renderYourRequests()}</Row>
          </Col>

          <Col>
            <h3>
              Trade requests for your books
              {' '}
              <Badge>{this.props.tradeProposedCount}</Badge>
            </h3>
            <div>{this.renderTradeRequests()}</div>
          </Col>

          <Col>
            <h3>My books {' '} <Badge>{this.props.yourBooksCount}</Badge></h3>
          </Col>
          <Col>
            <Checkbox
              className="onlyShowProposed"
              readOnly
              checked={this.state.onlyShowProposed}
              onClick={this.toggleOnlyShowProposed.bind(this)}
            >
              Only show books where a trade has been proposed
            </Checkbox>
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

MyBooks.propTypes = {
  books: PropTypes.array.isRequired,
  tradeProposedCount: PropTypes.number.isRequired,
  youProposedTradeCount: PropTypes.number.isRequired,
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
      yourBooksCount: Books.find({
        owner: Meteor.userId(),
      }).count(),
      tradeProposedCount: Books.find({
        tradeProposed: { $ne: false },
        owner: Meteor.userId(),
      }).count(),
      youProposedTradeCount: Books.find({
        tradeProposed: { $ne: false },
        proposedById: Meteor.userId(),
      }).count(),
      currentUser: Meteor.user(),
    };
  },
  MyBooks,
);
