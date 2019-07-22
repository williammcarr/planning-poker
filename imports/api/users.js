import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
  Meteor.publish('user.names', () => Meteor.users.find({}, { fields: {username: 1}}));
}

Meteor.methods({
  'users.register'({ username, password }) {
    Accounts.createUser({
      username: username,
      password: password,
    });
  },
});
