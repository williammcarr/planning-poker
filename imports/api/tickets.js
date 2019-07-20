import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import every from 'lodash/every';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import values from 'lodash/values';

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
      userVotes: {},
      pastVotes: null,
    });
  },
  'tickets.updateStatus'({ ticketId, status }) {
    Tickets.update(
      {_id: ticketId },
      {$set: { status: status } },
    );
  },
  'tickets.clearVotes'({ ticketId }) {
    let ticket = Tickets.findOne({ _id: ticketId });

    Tickets.update(
      {_id: ticketId },
      {$set: { pastVotes: ticket.userVotes, userVotes: {} } },
    );
  },
  'tickets.vote'({ ticketId, voteValue, voters}) {
    const userId = Meteor.userId();
    const string = `userVotes.${userId}`;

    Tickets.update(
      { _id: ticketId },
      { $set: { [string]: voteValue } }
    );

    let ticket = Tickets.findOne({ _id: ticketId });

    const haveVoted = [...keys(ticket.userVotes)];
    const everyoneHasVoted = every(voters, voter => includes(haveVoted, voter));

    if (everyoneHasVoted) {
      const unanimous = every(values(ticket.userVotes), vote => vote === voteValue);

      if (unanimous) {
        // this ticket is done
        Tickets.update(
          { _id: ticketId },
          { $set: { status: 'pointed', points: voteValue } }
        );
      } else {
        Tickets.update(
          { _id: ticketId },
          { $set: { status: 'discuss' } }
        );
      }
    }
  },
});
