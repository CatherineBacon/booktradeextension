import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  user.fullName = options.fullname || '';
  user.city = options.address || '';
  return user;
});
