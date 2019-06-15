import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Messages = new Mongo.Collection('messages');

Meteor.methods({
  'messages.create'({ text, location, userId, userName }) {
    Messages.insert({
      text,
      location,
      userId,
      userName,
      createdAt: moment().unix(),
    });
  },
});
