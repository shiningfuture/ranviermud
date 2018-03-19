'use strict';

/**
 * Basic mage spell
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Damage = require(srcPath + 'Damage');
  const SkillType = require(srcPath + 'SkillType');

  const damagePercent = 100;
  const manaCost = 20;

  function getDamage(player) {
    return player.getAttribute('intellect') * (damagePercent / 100);
  }

  return {
    name: 'Fireball',
    type: SkillType.SPELL,
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'mana',
      cost: manaCost,
    },
    cooldown: 10,

    run: state => function (args, player, target) {
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, '{bold With a wave of your hand, you unleash a {red fire}}{yellow b{bold all}} {bold at your target!}');
      Broadcast.sayAtExcept(player.room, `{bold With a wave of their hand, ${player.name} unleashes a {red fire}}{yellow b{bold all}} {bold at ${target.name}!}`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `{bold With a wave of their hand, ${player.name} unleashes a {red fire}}{yellow b{bold all}} {bold at you!}`);
      }
      damage.commit(target);
    },

    info: (player) => {
      return `Hurl a magical fireball at your target dealing ${damagePercent}% of your Intellect as Fire damage.`;
    }
  };
};
