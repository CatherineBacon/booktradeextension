import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Books } from '../../api/books.js';

import BookGrid from './BookGrid.jsx';

class YourRequests extends Component {
  render() {
    return (
      <div>
        <BookGrid books={this.props.books} />
      </div>
    );
  }
}

YourRequests.propTypes = {
  books: PropTypes.array.isRequired,
};

export default createContainer(
  () => {
    Meteor.subscribe('booksByTrader', Meteor.userId());

    return {
      books: Books.find(
        { proposedById: Meteor.userId() },
        {
          sort: { createdAt: -1 },
        },
      ).fetch(),
      currentUser: Meteor.user(),
    };
  },
  YourRequests,
);
