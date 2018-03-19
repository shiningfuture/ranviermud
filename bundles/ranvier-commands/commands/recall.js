'use strict';

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');

  return {
    usage: 'recall',
    command: state => (args, player) => {
      const home = player.getMeta('waypoints.home');
      if (!home) {
        return B.sayAt(player, 'You do not have a home waypoint set.');
      }

      B.sayAt(player, '{bold {cyan You pray to the gods to be returned home and are consumed by a bright blue light.}}');
      B.sayAtExcept(player.room, `{bold {cyan ${player.name} disappears in a flash of blue light.}}`, [player]);

      const nextRoom = state.RoomManager.getRoom(home);
      player.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', player);

        B.sayAt(player, '{bold {cyan The blue light dims and you find yourself at the wayshrine.}}');
        B.sayAtExcept(player.room, `{bold {cyan The waypiller glows brightly and ${player.name} appears in a flash of blue light.}}`, [player]);
      });
    }
  };
};
