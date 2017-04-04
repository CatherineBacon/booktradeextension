import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { _ } from 'lodash';

export const Books = new Mongo.Collection('books');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('books', limit => {
    check(limit, Number);
    return Books.find({}, { sort: { createdAt: -1 }, limit });
  });

  Meteor.publish('booksByOwner', (owner, limit) => {
    check(owner, String);
    check(limit, Number);

    return Books.find({ owner }, { sort: { createdAt: -1 }, limit });
  });
}

Meteor.methods({
  // Book counts
  'books.countAll'() {
    return Books.find().count();
  },

  'books.availableToTradeCount'() {
    return Books.find({
      tradeProposed: { $ne: true },
      owner: { $ne: Meteor.userId() },
    }).count();
  },

  'books.countByOwner'(owner) {
    check(owner, String);

    return Books.find({ owner }).count();
  },

  'books.countByTradeProposedByOwner'(owner) {
    check(owner, String);

    return Books.find({
      tradeProposed: { $ne: false },
      owner,
    }).count();
  },

  'books.countTradeProposedByUser'(user) {
    check(user, String);

    return Books.find({
      tradeProposed: { $ne: false },
      proposedById: user,
    }).count();
  },

  // Book manipulations
  'books.insert'(book) {
    check(
      book,
      Match.ObjectIncluding({
        title: String,
        authors: Match.Optional([String]),
        thumbnail: Match.Optional(String),
        description: Match.Optional(String),
      }),
    );

    // make sure user is logged in before inserting book
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const author = book.authors ? book.authors.join(', ') : null;
    const thumbnail = book.thumbnail || null;
    const description = _.truncate(book.description, { length: 500 }) || null;

    Books.insert({
      title: book.title,
      author,
      image: thumbnail,
      description,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      tradeProposed: false,
      proposedById: '',
      proposedByUsername: '',
    });
  },

  'books.declineTrade'(book) {
    Books.update(book._id, {
      $set: {
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: '',
      },
    });
  },

  'books.tradeBooks'(firstBook, secondBook) {
    check(firstBook, Object);
    check(secondBook, Object);

    if (firstBook.owner != Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const ownerOne = firstBook.owner;
    const usernameOne = firstBook.username;
    const ownerTwo = secondBook.owner;
    const usernameTwo = secondBook.username;

    Books.update(firstBook._id, {
      $set: {
        owner: ownerTwo,
        username: usernameTwo,
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: '',
      },
    });
    Books.update(secondBook._id, {
      $set: {
        owner: ownerOne,
        username: usernameOne,
        tradeProposed: false,
        proposedById: '',
        proposedByUsername: '',
      },
    });
    Meteor.call('successfulTrades.insert', firstBook, secondBook);
  },

  'books.remove'(book) {
    check(book._id, String);
    check(book.owner, String);

    if (book.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Books.remove(book._id);
  },

  'books.toggleTradeProposed'(book) {
    check(book._id, String);
    check(book.tradeProposed, Boolean);
    check(book.owner, String);

    if (!book.tradeProposed && Meteor.userId() == book.owner) {
      throw new Meteor.Error('not-authorized');
    }

    let proposedById = '';
    let proposedByUsername = '';
    if (!book.tradeProposed) {
      proposedById = Meteor.userId();
      proposedByUsername = Meteor.user().username;
    }

    if (book.tradeProposed && Meteor.userId() !== book.proposedById) {
      throw new Meteor.Error('not-authorized');
    }

    Books.update(book._id, {
      $set: {
        tradeProposed: !book.tradeProposed,
        proposedById,
        proposedByUsername,
      },
    });
  },
});
