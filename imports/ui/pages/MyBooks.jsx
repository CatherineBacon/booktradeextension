import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import VisibilitySensor from 'react-visibility-sensor';
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
import BookGrid from '../components/BookGrid.jsx';
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

  loadMore(isVisible) {
    if (isVisible) this.props.loadMore();
  }

  renderYourRequests() {
    const books = this.props.books;
    const filteredBooks = books.filter(
      book => book.proposedById === Meteor.userId(),
    );
    let bookComponents = [];

    filteredBooks.forEach((book, i) => {
      bookComponents.push(
        <Col sm={4} key={book._id} className="clearfix">
          <Book book={book} page="AllBooks" />
        </Col>,
      );

      if ((i + 1) % 3 === 0) {
        bookComponents.push(<Clearfix key={i} />);
      }
    });

    return bookComponents;
  }

  renderTradeRequests() {
    const books = this.props.books;
    const filteredBooks = books.filter(
      book => book.owner === Meteor.userId() && book.tradeProposed,
    );

    return filteredBooks.map(book => {
      const traderBooks = books.filter(b => book.proposedById === b.owner);
      return (
        <Media key={book._id}>
          <Media.Left>
            <img width={64} height={63} src={book.image} alt="BookCover" />
          </Media.Left>
          <Media.Body>
            <Media.Heading>{book.title}</Media.Heading>
            <p>Trade proposed by {book.proposedByUsername}</p>
            <Trader book={book} />
          </Media.Body>
        </Media>
      );
    });
  }

  renderBooks() {
    const books = this.props.books;
    let filteredBooks = books.filter(book => book.owner === Meteor.userId());

    if (this.state.onlyShowProposed) {
      filteredBooks = filteredBooks.filter(book => book.tradeProposed);
    }

    return <BookGrid books={filteredBooks} page="AllBooks" />;
  }

  render() {
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
          <VisibilitySensor
            onChange={this.loadMore.bind(this)}
            offset={{ direction: 'bottom', value: -300 }}
            active={this.props.canLoadMore}
          />
        </Row>
      );
    }
    return <PageHeader>Please login</PageHeader>;
  }
}

MyBooks.propTypes = {
  books: PropTypes.array.isRequired,
  tradeProposedCount: PropTypes.number.isRequired,
  youProposedTradeCount: PropTypes.number.isRequired,
  yourBooksCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
};

const limit = new ReactiveVar(10);
const bookCount = new ReactiveVar(0);
const yourBooksCount = new ReactiveVar(0);
const tradeProposedCount = new ReactiveVar(0);
const userProposedCount = new ReactiveVar(0);

export default createContainer(
  () => {
    Meteor.subscribe('booksByOwner', Meteor.userId(), limit.get());

    Meteor.call('books.countAll', (error, count) => {
      if (error) return console.log(error);
      bookCount.set(count);
    });

    Meteor.call('books.countByOwner', Meteor.userId(), (error, count) => {
      if (error) return console.log(error);
      yourBooksCount.set(count);
    });

    Meteor.call(
      'books.countByTradeProposedByOwner',
      Meteor.userId(),
      (error, count) => {
        if (error) return console.log(error);
        tradeProposedCount.set(count);
      },
    );

    Meteor.call(
      'books.countTradeProposedByUser',
      Meteor.userId(),
      (error, count) => {
        if (error) return console.log(error);
        userProposedCount.set(count);
      },
    );

    const canLoadMore = limit.get() < bookCount.get();

    return {
      books: Books.find(
        {},
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      yourBooksCount: yourBooksCount.get(),
      tradeProposedCount: tradeProposedCount.get(),
      youProposedTradeCount: userProposedCount.get(),
      currentUser: Meteor.user(),
      loadMore: () => limit.set(limit.get() + 5),
      canLoadMore,
    };
  },
  MyBooks,
);
