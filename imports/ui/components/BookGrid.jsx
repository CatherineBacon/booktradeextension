import React, { Component, PropTypes } from 'react';
import Masonry from 'react-masonry-component';

import Book from './Book.jsx';

export default class BookGrid extends Component {
  render() {
    return (
      <Masonry>
        {this.props.books.map(book => (
          <Book key={book._id} book={book} page={this.props.page} />
        ))}
      </Masonry>
    );
  }
}

BookGrid.propTypes = {
  books: PropTypes.array.isRequired,
};
