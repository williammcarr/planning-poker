import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
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
    });
  },
  'tickets.vote'({ ticketId, voteValue, voters}) {
    let userId = Meteor.userId();
    let ticket = Tickets.findOne({ _id: ticketId });
    let haveVoted = [...keys(ticket.userVotes)];

    // Include our vote in haveVoted, as we have not updated the Ticket to include our vote yet
    haveVoted.push(userId);

    const string = `userVotes.${userId}`;

    Tickets.update(
      {_id: ticketId },
      {$set: { [string]: voteValue } },
    );

    if (isEqual(haveVoted.sort(), voters.sort())) {
      let allVoteValues = values(ticket.userVotes);
      allVoteValues.push(voteValue);

      let totalPoints = 0;
      let numVotes = haveVoted.length;

      totalPoints = reduce(allVoteValues, function(sum, val) {
        return sum + parseInt(val);
      }, 0);

      let avg = Math.round(totalPoints / numVotes);

      Tickets.update(
        {_id: ticketId },
        {$set: { status: 'closed' } },
        {$set: { points: avg } },
      );
    }
  },
});
