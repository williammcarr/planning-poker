import { Mongo } from 'meteor/mongo';
import reject from 'lodash/reject';
export const Rooms = new Mongo.Collection('rooms');
/**

text      // name of the room   String
userId    // owner id           String
userName  // owner name         String
voters    // participants       [String]

**/

Meteor.methods({
  'rooms.join'({ roomId, userId, username }) {
    // maybe use userId someday
    Rooms.update({ _id: roomId }, { $push: { voters: username } });
  },
  'rooms.leave'({ roomId, userId, username }) {
    const room = Rooms.findOne({ _id: roomId });
    let voters = reject(room.voters, (voterName) => (voterName == username));
    // maybe use userId someday
    Rooms.update({ _id: roomId }, { $set: { voters } });
  },
});
