import { Mongo } from 'meteor/mongo';
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
      voters: [],
    });
  },
  'rooms.join'({ roomId }) {
    // maybe use userId someday
    const user = Meteor.user();
    Rooms.update({ _id: roomId }, { $push: { voters: user.username } });
  },
  'rooms.leave'({ roomId }) {
    const room = Rooms.findOne({ _id: roomId });
    const user = Meteor.user();
    const voters = reject(room.voters, (voterName) => (voterName === user.username));
    // maybe use userId someday
    Rooms.update({ _id: roomId }, { $set: { voters } });
  },
});
