import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
  Meteor.publish('users', () => Meteor.users.find({}, { fields: { username: 1, status: 1 } }));
  Meteor.publish('users.all', () => Users.find());
}

Meteor.methods({
  'users.register'({ username, password }) {
    Accounts.createUser({
      username: username,
      password: password,
    });
  },
  'users.updateLocations'({ userId, rooms }) {
    Users.update(
      { _id: userId }, 
      {$set: { rooms: rooms } },
    );
  },
});
