'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        Broadcast.sayAt(player);
        Broadcast.sayAt(player, `{bold {cyan Hint: You can pick up items from the room listed in '{white look}' with '{white get}' followed by a reasonable keyword for the item e.g., '{white get cheese}'. Some items, like the chest, may contain items; you can check by looking at the item.}}`, 80);
      }
    }
  };
};
