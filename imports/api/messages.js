import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Messages = new Mongo.Collection('messages');

Meteor.methods({
  'messages.create'({ text, location, userId, username }) {
    Messages.insert({
      text,
      location,
      userId,
      username,
      createdAt: moment().unix(),
    });
  },
});
