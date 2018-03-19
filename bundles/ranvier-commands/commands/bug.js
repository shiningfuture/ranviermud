'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'bug <description>',
    aliases: ['typo', 'suggestion'],
    command: state => (args, player, arg0) => {
      if (!args) {
        return Broadcast.sayAt(player, '{bold {yellow Please describe the bug you have found.}}');
      }

      player.emit('bugReport', {
        description: args,
        type: arg0
      });

      Broadcast.sayAt(player, `{bold Your ${arg0} report has been submitted as:}\n${args}`);
      Broadcast.sayAt(player, '{bold Thanks!}');
    }
  };
};