import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  Meteor.publish('messages', (location) => Messages.find({ location }));
}

Meteor.methods({
  'messages.insert'({ text, location, userId, username }) {
    Messages.insert({
      text,
      location,
      userId,
      username,
      createdAt: moment().unix(),
    });
  },
});
