import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

Accounts.onCreateUser((options, user) => {

    // Notify Catherine
    Email.send({
	to: 'catherine.bacon+books@gmail.com',
	from: 'no-reply@books.catherinebacon.co.uk',
	subject: `New user created - ${user.username}`,
	text: `User ${user.username} was created with email address ${user.emails[0].address}`
    });
    
  user.fullName = options.fullname || '';
  user.city = options.address || '';
  return user;
});
