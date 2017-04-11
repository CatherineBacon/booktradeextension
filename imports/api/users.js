import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

if (Meteor.isServer) {
  Meteor.publish('Meteor.users.additionalinfo', function() {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          fullName: 1,
          street: 1,
          city: 1,
          country: 1,
          postcode: 1,
        },
      },
    );
  });
}

Meteor.methods({
  'Meteor.users.additionalinfo.update'(
    fullName,
    street,
    city,
    country,
    postcode,
  ) {
    check(fullName, String);
    check(street, String);
    check(city, String);
    check(country, String);
    check(postcode, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (fullName.length === 0) fullName = Meteor.user().fullName;
    if (street.length === 0) street = Meteor.user().street;
    if (city.length === 0) city = Meteor.user().street;
    if (country.length === 0) country = Meteor.user().coutnry;
    if (postcode.length === 0) postcode = Meteor.user().postcode;

    Meteor.users.update(
      { _id: Meteor.user()._id },
      {
        $set: {
          fullName,
          street,
          city,
          country,
          postcode: postcode.toUpperCase(),
        },
      },
    );
  },

  sendTradeAgreedEmail(userOneId, userOneTitle, userTwoId, userTwoTitle) {
    check(userOneId, String);
    check(userOneTitle, String);
    check(userTwoId, String);
    check(userTwoTitle, String);

    console.log(Meteor.users.findOne({ _id: userOneId }));
    console.log(Meteor.users.findOne({ _id: userTwoId }));
    const userOne = Meteor.users.findOne({ _id: userOneId });
    const userTwo = Meteor.users.findOne({ _id: userTwoId });

    if (Meteor.isServer) {
      console.log('userOne: ', userOne.emails[0].address);
      console.log('userTwo: ', userTwo.emails[0].address);

      const textForOne = `Traded ${userOneTitle} for ${userTwoTitle} with ` +
        `${userTwo.fullName} (${userTwo.emails[0].address})\n` +
        `Send ${userOneTitle} to ${userTwo.fullName} at ` +
        `${userTwo.street}, ${userTwo.city}, ${userTwo.country}, ${userTwo.postcode}`;
      const textForTwo = `Traded ${userTwoTitle} for ${userOneTitle} with ` +
        `${userOne.fullName} (${userOne.emails[0].address})\n` +
        `Send ${userTwoTitle} to ${userOne.fullName} at ` +
        `${userOne.street}, ${userOne.city}, ${userOne.country}, ${userOne.postcode}`;

      Email.send({
        to: userOne.emails[0].address,
        from: 'dummyFrom@mail.com',
        subject: 'Trade agreed!',
        text: textForOne,
      });

      Email.send({
        to: userTwo.emails[0].address,
        from: 'dummyFrom@mail.com',
        subject: 'Trade agreed!',
        text: textForTwo,
      });
    }
  },
});
