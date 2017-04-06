import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'lodash';
import VisibilitySensor from 'react-visibility-sensor';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  PageHeader,
  Checkbox,
  Badge,
  FormControl,
  Button,
  InputGroup,
} from 'react-bootstrap';

import { Books } from '../../api/books';

import BookGrid from '../components/BookGrid.jsx';

class AllBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideTradeProposed: false,
      hideMyBooks: true,
      searchText: '',
    };

    this.toggleHideTradeProposed = this._toggleHideTradeProposed.bind(this);
    this.toggleHideMyBooks = this._toggleHideMyBooks.bind(this);
    this.loadMore = this._loadMore.bind(this);
    this.handleSearch = this._handleSearch.bind(this);
    this.handleClear = this._handleClear.bind(this);
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
    this.setState({ searchText: event.target.value });
    this.props.searchBooks(term);
  }

  _handleClear(event) {
    event.preventDefault();
    this.setState({ searchText: '' });
    this.props.clearSearch();
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

    return <BookGrid books={filteredBooks} />;
  }

  render() {
    return (
      <Row>
        <Col>
          <PageHeader>
            All Books <small className="pull-right">
              Books available to trade:
              {' '}
              <Badge>{this.props.availableToTradeCount}</Badge>
            </small>
          </PageHeader>
        </Col>

        {!this.props.currentUser &&
          <h2 className="login-reminder text-warning">
            Remember, you need to <Link to="/profile">log in</Link> to trade!
          </h2>}

        <Col>
          <InputGroup>
            <InputGroup.Addon>Search All Books:</InputGroup.Addon> {' '}
            <FormControl
              type="text"
              onChange={this.handleSearch}
              value={this.state.searchText}
            />
            <span className="input-group-btn">
              <Button
                className="btn btn-default"
                bsStyle="primary"
                onClick={this.handleClear}
              >
                Clear Search
              </Button>
            </span>
          </InputGroup>
        </Col>

        <Col xs={12}>
          <span className="pull-right" />
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
            {this.props.searching && <p>loading...</p>}
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
}

AllBooks.propTypes = {
  books: PropTypes.array.isRequired,
  availableToTradeCount: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  canLoadMore: PropTypes.bool.isRequired,
  searchBooks: PropTypes.func.isRequired,
  clearSearch: PropTypes.func.isRequired,
  searching: PropTypes.bool,
  currentUser: PropTypes.object,
};

AllBooks.defaultProps = {
  searching: false,
  currentUser: null,
};

const limit = new ReactiveVar(10);
const bookCount = new ReactiveVar(0);
const availableToTradeCount = new ReactiveVar(0);
const searchTerm = new ReactiveVar('');

export default createContainer(
  () => {
    const sub = Meteor.subscribe('books', limit.get(), searchTerm.get());

    Meteor.call('books.countAll', (error, count) => {
      if (error) return console.log(error);
      bookCount.set(count);
    });

    const canLoadMore = limit.get() < bookCount.get();

    const searchBooks = _.debounce(term => searchTerm.set(term), 1000);
    const clearSearch = () => searchTerm.set('');

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
      clearSearch,
      searching: !sub.ready(),
    };
  },
  AllBooks,
);
