import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  Meteor.publish('Meteor.users.additionalinfo', function() {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          fullName: 1,
          city: 1,
          country: 1,
        },
      },
    );
  });
}

Meteor.methods({
  'Meteor.users.additionalinfo.update'(fullName, city, country) {
    check(fullName, String);
    check(city, String);
    check(country, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update(
      { _id: Meteor.user()._id },
      {
        $set: {
          fullName: fullName,
          city: city,
          country: country,
        },
      },
    );
  },
});
