import { Meteor } from 'meteor/meteor';

import '../imports/api/books.js';
import '../imports/api/users.js';
import '../imports/api/successfulTrades.js';
import '../imports/startup/accounts-callbacks.js';

Meteor.startup(() => {
  // code to run on server at startup
});
