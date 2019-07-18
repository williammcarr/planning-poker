import { Mongo } from 'meteor/mongo';

import moment from 'moment';
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

    return Rooms.insert({
      text,
      userId: user._id,
      username: user.username,
      voters: [user._id],
      createdAt: moment().unix(),
    });
  },
  'rooms.join'({ roomId }) {
    // maybe use userId someday
    const user = Meteor.user();
    Rooms.update({ _id: roomId }, { $push: { voters: user._id } });
  },
  'rooms.leave'({ roomId }) {
    const room = Rooms.findOne({ _id: roomId });
    const user = Meteor.user();
    const voters = reject(room.voters, (voterId) => (voterId === user._id));
    // maybe use userId someday
    Rooms.update({ _id: roomId }, { $set: { voters } });
  },
});
