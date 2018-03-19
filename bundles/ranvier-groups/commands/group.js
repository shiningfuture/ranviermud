'use strict';

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const say = B.sayAt;
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const CommandManager = require(srcPath + 'CommandManager');

  const subcommands = new CommandManager();
  subcommands.add({
    name: 'create',
    command: state => (args, player) => {
      if (player.party) {
        return say(player, "You're already in a group.");
      }

      state.PartyManager.create(player);
      say(player, "{bold {green You created a group, invite players with '{white group invite <name>}'}}");
    }
  });

  subcommands.add({
    name: 'invite',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "You don't have a group, create one with '{bold group create}'.");
      }

      if (player.party && player !== player.party.leader) {
        return say(player, "You aren't the leader of the group.");
      }

      if (!args.length) {
        return say(player, "Invite whom?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (target === player) {
        return say(player, "You ask yourself if you want to join your own group. You humbly accept.");
      }

      if (!target) {
        return say(player, "They aren't here.");
      }

      if (target.party) {
        return say(player, "They are already in a group.");
      }

      say(target, `{bold {green ${player.name} invited you to join their group. Join/decline with '{white group join/decline ${player.name}}'}}`);
      say(player, `{bold {green You invite ${target.name} to join your group.}}`);
      player.party.invite(target);
      B.prompt(target);
    }
  }
  );

  subcommands.add({
    name: 'disband',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "You aren't in a group.");
      }

      if (player !== player.party.leader) {
        return say(player, "You aren't the leader of the group.");
      }

      if (!args || args !== 'sure') {
        return say(player, `{bold {green You have to confirm disbanding your group with '{white group disband sure}'}}`);
      }

      say(player.party, '{bold {green Your group was disbanded!}}');
      state.PartyManager.disband(player.party);
    }
  });

  subcommands.add({
    name: 'join',
    command: state => (args, player) => {
      if (!args.length) {
        return say(player, "Join whose group?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (!target) {
        return say(player, "They aren't here.");
      }

      if (!target.party || target !== target.party.leader) {
        return say(player, "They aren't leading a group.");
      }

      if (!target.party.isInvited(player)) {
        return say(player, "They haven't invited you to join their group.");
      }

      say(player, `{bold {green You join ${target.name}'s group.}}`);
      say(target.party, `{bold {green ${player.name} joined the group.}}`);
      target.party.add(player);
      player.follow(target);
    }
  });

  subcommands.add({
    name: 'decline',
    command: state => (args, player) => {
      if (!args.length) {
        return say(player, "Decline whose invite?");
      }

      const target = Parser.parseDot(args, player.room.players);

      if (!target) {
        return say(player, "They aren't here.");
      }

      say(player, `{bold {green You decline to join ${target.name}'s group.}}`);
      say(target, `{bold {green ${player.name} declined to join your group.}}`);
      target.party.removeInvite(player);
    }
  });

  subcommands.add({
    name: 'leave',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "You're not in a group.");
      }

      const party = player.party;
      player.party.delete(player);
      say(party, `{bold {green ${player.name} left the group.}}`);
      say(player, '{bold {green You leave the group.}}');
    }
  });

  subcommands.add({
    name: 'list',
    command: state => (args, player) => {
      if (!player.party) {
        return say(player, "You're not in a group.");
      }

      say(player, '{bold ' + B.center(80, 'Group', 'green', '-') + '}');
      for (const member of player.party) {
        let tag = '   ';
        if (member === player.party.leader) {
          tag = '[L]';
        }
        say(player, `{bold {green ${tag} ${member.name}}}`);
      }
    }
  });

  return {
    aliases: [ 'party' ],
    command: state => (args, player) => {

      if (!args || !args.length) {
        args = 'list';
      }

      const [ command, ...commandArgs ] = args.split(' ');
      const subcommand = subcommands.find(command);

      if (!subcommand) {
        return say(player, "Not a valid party command.");
      }

      subcommand.command(state)(commandArgs.join(' '), player);
    }
  };
};
