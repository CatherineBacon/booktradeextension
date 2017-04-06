import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  Form,
} from 'react-bootstrap';

import { Books } from '../../api/books.js';

import Book from './Book.jsx';

class Trader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Decline Trade',
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const choice = this.state.value;
    if (choice === 'Decline Trade') {
      Meteor.call('books.declineTrade', this.props.book);
      return;
    }
    const secondBook = this.props.traderBooks.filter(b => b._id === choice)[0];

    Meteor.call('books.tradeBooks', this.props.book, secondBook);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  renderTraderBooks() {
    return this.props.traderBooks.map(book => {
      const author = book.author ? `by ${book.author}` : '';
      return (
        <option key={book._id} value={book._id}>
          {book.title} {author}
        </option>
      );
    });
  }

  render() {
    if (!this.props.book.tradeProposed) {
      return <span />;
    }
    return (
      <Form inline onSubmit={this.handleSubmit.bind(this)}>
        <FormGroup bsSize="small">
          <ControlLabel>Select a book to exchange: </ControlLabel>
          {' '}
          <FormControl
            componentClass="select"
            placeholder="select"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          >
            <option key="decline" value="Decline Trade">Decline Trade</option>
            {this.renderTraderBooks()}
          </FormControl>
        </FormGroup>
        {' '}
        <Button type="submit" bsSize="small">Go!</Button>
      </Form>
    );
  }
}

Trader.propTypes = {
  book: PropTypes.object.isRequired,
  traderBooks: PropTypes.array.isRequired,
};

export default createContainer(
  props => {
    const traderId = props.book.proposedById;
    Meteor.subscribe('booksByOwner', traderId);

    return {
      traderBooks: Books.find(
        { owner: traderId },
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      currentUser: Meteor.user(),
    };
  },
  Trader,
);
