import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../api/books.js';

import Book from './Book.jsx'

class App extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const title = ReactDOM.findDOMNode(this.refs.titleInput).value.trim();
    const author = ReactDOM.findDOMNode(this.refs.authorInput).value.trim();

    Books.insert({
      title,
      author,
      createdAt: new Date(),
    });

    // clear form
    ReactDOM.findDOMNode(this.refs.titleInput).value = '';
    ReactDOM.findDOMNode(this.refs.authorInput).value = '';
  }

  renderBooks() {
    return this.props.books.map((book) => (
      <Book key={book._id} book={book} />
    ));
  }

  render() {
    return (
      <div className='container'>
        <header>
          <h1>Book Exchange!</h1>
        </header>
        <h2>My Books</h2>
        <h4>Add book</h4>

        <form className="new-book" onSubmit={this.handleSubmit.bind(this)} >
          <input
            type='text'
            ref='titleInput'
            placeholder='Title'
          />
          <input
            type='text'
            ref='authorInput'
            placeholder='Author'
          />
          <input
            type='submit'
            value='Add'
          />
        </form>

        <h2>All Books</h2>
        <ul>
          {this.renderBooks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  books: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    // will also want to search by not requested/requested
    books: Books.find({}, {
      sort: { createdAt: -1 }
    }).fetch(),
  };
}, App);
