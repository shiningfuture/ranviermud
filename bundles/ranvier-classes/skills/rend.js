'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

/**
 * DoT (Damage over time) skill
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');

  // config placed here just for easy copy/paste of this skill later on
  const attribute = 'strength';
  const cooldown = 10;
  const cost = 50;
  const duration = 20 * 1000;
  const tickInterval = 3;
  const damagePercent = 400;

  const totalDamage = player => {
    return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
  };

  return {
    name: 'Rend',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'energy',
      cost,
    },
    cooldown,

    run: state => function (args, player, target) {
      const effect = state.EffectFactory.create(
        'skill.rend',
        target,
        {
          duration,
          description: this.info(player),
          tickInterval,
        },
        {
          totalDamage: totalDamage(player),
        }
      );
      effect.skill = this;
      effect.attacker = player;

      effect.on('effectDeactivated', _ => {
        Broadcast.sayAt(player, `{red {bold ${target.name}} stops bleeding.}`);
      });

      Broadcast.sayAt(player, `{red With a vicious attack you open a deep wound in {bold ${target.name}}!}`);
      Broadcast.sayAtExcept(player.room, `{red ${player.name} viciously rends ${target.name}.}`, [target, player]);
      Broadcast.sayAt(target, `{red ${player.name} viciously rends you!}`);
      target.addEffect(effect);
    },

    info: (player) => {
      return `Tear a deep wound in your target's flesh dealing {bold ${damagePercent}%} weapon damage over {bold ${duration / 1000}} seconds.`;
    }
  };
};
