import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import every from 'lodash/every';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';
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
    let userId = Meteor.userId();
    let ticket = Tickets.findOne({ _id: ticketId });
    let haveVoted = [...keys(ticket.userVotes)];
    const string = `userVotes.${userId}`;

    // Include our vote in haveVoted, as we have not updated the Ticket to include our vote yet
    haveVoted.push(userId);

    voters = uniq(voters);
    haveVoted = uniq(haveVoted);

    Tickets.update(
      {_id: ticketId },
      {$set: { [string]: voteValue } },
    );

    if (isEqual(haveVoted.sort(), voters.sort())) {
      let unanimous = every(values(ticket.userVotes), function(val) {
        return val == voteValue;
      });

      if (unanimous) {
        Tickets.update(
          {_id: ticketId },
          {$set: { status: 'pointed', points: voteValue } },
        );
      } else {
        Tickets.update(
          {_id: ticketId },
          {$set: { status: 'discuss' } },
        );
      }
    }
  },
});
