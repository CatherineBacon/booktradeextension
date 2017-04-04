import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import './book.css';
import {
  Thumbnail,
  Button,
  Glyphicon,
  Checkbox,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap';

import { Books } from '../../api/books.js';

const defaultImage = '/image/book.png';

export default class Book extends Component {
  toggleTradeProposed() {
    Meteor.call('books.toggleTradeProposed', this.props.book);
  }

  deleteThisBook() {
    Meteor.call('books.remove', this.props.book);
  }

  hideTradeCheckbox() {
    if (this.props.book.owner == Meteor.userId()) return true;
    if (
      this.props.book.tradeProposed &&
      this.props.book.proposedById != Meteor.userId()
    ) {
      return true;
    }
    return false;
  }

  render() {
    const bookClassName = this.props.book.tradeProposed ? 'tradeProposed' : '';
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
        className={bookClassName + ' book'}
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
              onClick={this.deleteThisBook.bind(this)}
            >
              <Glyphicon glyph="remove" />
            </Button>}
        </h4>

        {this.props.page != 'MyBooks'
          ? <h4 hidden={this.hideTradeCheckbox()}>
              <Checkbox
                readOnly
                checked={book.tradeProposed}
                onClick={this.toggleTradeProposed.bind(this)}
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
