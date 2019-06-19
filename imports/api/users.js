import { Mongo } from 'meteor/mongo';

Meteor.methods({
  'users.register'({ username, password }) {
    Accounts.createUser({
      username: username,
      password: password,
    });
  },
});