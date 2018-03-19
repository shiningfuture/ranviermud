'use strict';

/**
 * Shut down the MUD from within the game.
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const PlayerRoles = require(srcPath + 'PlayerRoles');

  return {
    requiredRole: PlayerRoles.ADMIN,
    command: state => (time, player) => {
      if (time === 'now') {
        Broadcast.sayAt(state.PlayerManager, '{bold {yellow Game is shutting down now!}}');
        state.PlayerManager.saveAll();
        process.exit();
        return;
      }

      if (!time.length || time !== 'sure') {
        return Broadcast.sayAt(player, 'You must confirm the shutdown with "shutdown sure" or force immediate shutdown with "shutdown now"');
      }

      Broadcast.sayAt(state.PlayerManager, `{bold {yellow Game will shut down in ${30} seconds.}}`);
      setTimeout(_ => {
        Broadcast.sayAt(state.PlayerManager, '{bold {yellow Game is shutting down now!}}');
        state.PlayerManager.saveAll();
        process.exit();
      }, 30000);
    }
  };
};
