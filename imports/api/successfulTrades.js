import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SuccessfulTrades = new Mongo.Collection('successfulTrades');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('successfulTrades', function tradesPublication() {
    return SuccessfulTrades.find({ owner: this.userId });
  });
}

Meteor.methods({
  'successfulTrades.insert'(firstBook, secondBook) {
    check(firstBook, Object);
    check(secondBook, Object);

    SuccessfulTrades.insert({
      owner: firstBook.owner,
      username: firstBook.username,
      trader: secondBook.owner,
      traderUsername: secondBook.username,
      ownerBookId: firstBook._id,
      ownerBookTitle: firstBook.title,
      traderBookId: secondBook._id,
      traderBookTitle: secondBook.title,
      createdAt: new Date()
    });

    SuccessfulTrades.insert({
      owner: secondBook.owner,
      username: secondBook.username,
      trader: firstBook.owner,
      traderUsername: firstBook.username,
      ownerBookId: secondBook._id,
      ownerBookTitle: secondBook.title,
      traderBookId: firstBook._id,
      traderBookTitle: firstBook.title,
      createdAt: new Date()
    });
  }
});
