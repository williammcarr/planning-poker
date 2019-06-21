import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer) {
  Meteor.publish('tickets', (roomId) => Tickets.find({ roomId }));
}

Meteor.methods({
  'tickets.insert'({ name, description, roomId }) {
    check(name, String);
    check(description, String);
    check(roomId, String);

    Tickets.insert({
      description,
      name,
      points: null,
      roomId,
      status: 'new',
    });
  },
});
