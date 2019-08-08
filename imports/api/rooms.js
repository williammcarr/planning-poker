import { Mongo } from 'meteor/mongo';

import moment from 'moment';
import includes from 'lodash/includes';
import reject from 'lodash/reject';

export const Rooms = new Mongo.Collection('rooms');
/**

text      // name of the room   String
userId    // owner id           String
userName  // owner name         String
voters    // participants       [String]

**/

if (Meteor.isServer) {
  Meteor.publish('rooms.all', () => Rooms.find());
  Meteor.publish('room', (roomId) => Rooms.find({ _id: roomId }));
}

Meteor.methods({
  'rooms.insert'(text) {
    const user = Meteor.user();
    const userId = Meteor.userId();

    return Rooms.insert({
      text,
      userId: userId,
      username: user.username,
      voters: [userId],
      createdAt: moment().unix(),
    });
  },
  'rooms.join'({ roomId }) {
    const userId = Meteor.userId();
    const room = Rooms.findOne(roomId);

    if (includes(room.voters, userId)) return;

    Rooms.update({ _id: roomId }, { $push: { voters: userId } });
    Meteor.users.update({ _id: userId }, { $push: { rooms: roomId } });
  },
  'rooms.leave'({ roomId }) {
    const room = Rooms.findOne(roomId);
    const user = Meteor.user();
    const userId = Meteor.userId();
    
    const voters = reject(room.voters, (voterId) => (voterId === userId));
    const rooms = reject(user.locations, (location) => (location === roomId));

    Rooms.update({ _id: roomId }, { $set: { voters } });
    Meteor.users.update({ _id: userId }, { $set: { rooms: rooms } });
  },
});
