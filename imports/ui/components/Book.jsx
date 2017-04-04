import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Thumbnail,
  Button,
  Glyphicon,
  Checkbox,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap';

import './book.css';

const defaultImage = '/image/book.png';

export default class Book extends Component {
  constructor(props) {
    super(props);

    this.deleteThisBook = this._deleteThisBook.bind(this);
    this.toggleTradeProposed = this._toggleTradeProposed.bind(this);
  }

  _toggleTradeProposed() {
    Meteor.call('books.toggleTradeProposed', this.props.book);
  }

  _deleteThisBook() {
    Meteor.call('books.remove', this.props.book);
  }

  hideTradeCheckbox() {
    if (this.props.book.owner === Meteor.userId()) return true;
    if (
      this.props.book.tradeProposed &&
      this.props.book.proposedById !== Meteor.userId()
    ) {
      return true;
    }
    return false;
  }

  render() {
    const bookClassName = this.props.book.tradeProposed
      ? 'tradeProposed book'
      : 'book';
    const { book } = this.props;
    const canDelete = book.owner === Meteor.userId();
    const overlay = (
      <Popover title={book.title} id={book.title}>
        {book.description || <em>no description</em>}
      </Popover>
    );

    return (
      <Thumbnail
        src={book.image || defaultImage}
        alt="cover picture"
        className={bookClassName}
      >

        <h4 className={bookClassName}>

          <OverlayTrigger trigger={['hover', 'focus']} overlay={overlay}>
            <span>
              <strong>{book.title}</strong>
              {' '}
              by
              {' '}
              {book.author || <em>unknown</em>}
            </span>
          </OverlayTrigger>
          {' '}
          {canDelete &&
            <Button
              bsStyle="danger"
              bsSize="xsmall"
              className="delete"
              onClick={this.deleteThisBook}
            >
              <Glyphicon glyph="remove" />
            </Button>}
        </h4>

        {this.props.page !== 'MyBooks'
          ? <h4 hidden={this.hideTradeCheckbox()}>
              <Checkbox
                readOnly
                checked={book.tradeProposed}
                onClick={this.toggleTradeProposed}
                inline
              >
                Request trade
              </Checkbox>
            </h4>
          : null}
      </Thumbnail>
    );
  }
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
};
