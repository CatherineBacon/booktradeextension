import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import VisibilitySensor from 'react-visibility-sensor';
import { Row, Col, PageHeader, Checkbox, Badge } from 'react-bootstrap';

import { Books } from '../../api/books';

import BookGrid from '../components/BookGrid.jsx';

class AllBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTradeProposed: false,
      hideMyBooks: true,
    };

    this.toggleHideTradeProposed = this._toggleHideTradeProposed.bind(this);
    this.toggleHideMyBooks = this._toggleHideMyBooks.bind(this);
    this.loadMore = this._loadMore.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
  }

  _toggleHideTradeProposed() {
    this.setState({
      hideTradeProposed: !this.state.hideTradeProposed,
    });
  }

  _toggleHideMyBooks() {
    this.setState({
      hideMyBooks: !this.state.hideMyBooks,
    });
  }

  _loadMore(isVisible) {
    if (isVisible) this.props.loadMore();
  }

  _handleSearch(event) {
    event.preventDefault();
    const term = event.target.value.trim();
    this.props.searchBooks(term);
  }

  renderBooks() {
    let filteredBooks = this.props.books;
    if (this.state.hideTradeProposed) {
      filteredBooks = filteredBooks.filter(book => !book.tradeProposed);
    }
    if (this.state.hideMyBooks) {
      filteredBooks = filteredBooks.filter(
        book => book.owner !== Meteor.userId(),
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

          <Col>
            <input type="text" onChange={this.handleSearch} />
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
              onClick={this.toggleHideTradeProposed}
            >
              Hide books where trade has been proposed
            </Checkbox>
          </Col>

          <Col>
            <Checkbox
              className="hide-myBooks"
              readOnly
              checked={this.state.hideMyBooks}
              onClick={this.toggleHideMyBooks}
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
          <VisibilitySensor
            onChange={this.loadMore}
            offset={{ direction: 'bottom', value: -300 }}
            active={this.props.canLoadMore}
          />
        </Row>
      );
    }
    return <PageHeader>Please login</PageHeader>;
  }
}

AllBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  searchBooks: PropTypes.func.isRequired,
};

const limit = new ReactiveVar(10);
const bookCount = new ReactiveVar(0);
const availableToTradeCount = new ReactiveVar(0);
const searchTerm = new ReactiveVar('');

export default createContainer(
  () => {
    Meteor.subscribe('books', limit.get(), searchTerm.get());

    Meteor.call('books.countAll', (error, count) => {
      if (error) return console.log(error);
      bookCount.set(count);
    });

    const canLoadMore = limit.get() < bookCount.get();

    const searchBooks = term => searchTerm.set(term);

    Meteor.call('books.availableToTradeCount', (error, count) => {
      if (error) return console.log(error);
      availableToTradeCount.set(count);
    });

    return {
      books: Books.find(
        {},
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      availableToTradeCount: availableToTradeCount.get(),
      currentUser: Meteor.user(),
      loadMore: () => limit.set(limit.get() + 5),
      canLoadMore,
      searchBooks,
    };
  },
  AllBooks,
);
