'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        Broadcast.sayAt(player);
        Broadcast.sayAt(player, `{bold {cyan Hint: Waypoints allow you to travel vast distances. Save waypoints with '{white waypoint save}', set your preferred home with '{white waypoint home}. If you have enough energy you can return home at any time with '{white recall}'.}}`, 80);
      }
    }
  };
};
