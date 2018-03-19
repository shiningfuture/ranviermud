'use strict';

/**
 * Ban a player's account. They will still be able to connect to the game
 * and create other accounts.
 */
module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');
  const PlayerRoles = require(srcPath + 'PlayerRoles');

  return {
    usage: 'accountban <player> sure',
    requiredRole: PlayerRoles.ADMIN,
    command: state => (args, player) => {
      const say = message => B.sayAt(player, message);

      if (!args || !args.length) {
        return say('Must specify an online player to ban.');
      }

      const [targetName, confirm] = args.split(' ');

      if (!confirm || confirm !== 'sure') {
        return say('Must confirm ban with "accountban player sure"');
      }

      const target = state.PlayerManager.getPlayer(targetName);
      if (!target) {
        return say('No such player online.');
      }

      B.sayAt(target, '{bold {red SLAM! A mighty hammer appears from the sky and crushes you! You have been BANNED!}}');
      say(`{bold {red SLAM! A mighter hammer appears from the sky and crushes ${target.name}! They have been BANNED!}}`);
      target.account.ban();
      target.socket.emit('close');
    }
  };
};
