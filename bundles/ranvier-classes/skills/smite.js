'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');
  const Damage = require(srcPath + 'Damage');
  const Heal = require(srcPath + 'Heal');

  // config placed here just for easy copy/paste of this skill later on
  const cooldown = 10;
  const damagePercent = 350;
  const favorAmount = 5;

  return {
    name: 'Smite',
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'favor',
      cost: favorAmount
    },
    cooldown,

    run: state => function (args, player, target) {
      if (!player.equipment.has('wield')) {
        return Broadcast.sayAt(player, "You don't have a weapon equipped.");
      }

      const damage = new Damage({
        attribute: 'health',
        amount: Combat.calculateWeaponDamage(player) * (damagePercent / 100),
        attacker: player,
        type: 'holy',
        source: this
      });

      Broadcast.sayAt(player, `{bold {yellow Your weapon radiates holy energy and you strike ${target.name}!}}`);
      Broadcast.sayAtExcept(player.room, `{bold {yellow ${player.name}'s weapon radiates holy energy and they strike ${target.name}!}}`, [target, player]);
      Broadcast.sayAt(target, `{bold {yellow ${player.name}'s weapon radiates holy energy and they strike you!}}`);

      damage.commit(target);
    },

    info: (player) => {
      return `Empower your weapon with holy energy and strike, dealing {bold ${damagePercent}%} weapon damage. Requires a weapon.`;
    }
  };
};
