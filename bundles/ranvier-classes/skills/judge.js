'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');
  const Damage = require(srcPath + 'Damage');
  const Heal = require(srcPath + 'Heal');

  // config placed here just for easy copy/paste of this skill later on
  const cooldown = 4;
  const damagePercent = 150;
  const favorAmount = 3;
  const reductionPercent = 30;

  return {
    name: 'Judge',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    cooldown,

    run: state => function (args, player, target) {
      const effect = state.EffectFactory.create('skill.judge', target, {}, { reductionPercent });
      effect.skill = this;
      effect.attacker = player;

      const damage = new Damage({
        attribute: 'health',
        amount: Combat.calculateWeaponDamage(player) * (damagePercent / 100),
        attacker: player,
        type: 'holy',
        source: this
      });

      const favorRestore = new Heal({
        attribute: 'favor',
        amount: favorAmount,
        source: this
      });

      Broadcast.sayAt(player, `{bold {yellow Concentrated holy energy slams into ${target.name}!}}`);
      Broadcast.sayAtExcept(player.room, `{bold {yellow ${player.name} conjures concentrated holy energy and slams it into ${target.name}!}}`, [target, player]);
      Broadcast.sayAt(target, `{bold {yellow ${player.name} conjures concentrated holy energy and slams it into you!}}`);

      damage.commit(target);
      target.addEffect(effect);
      favorRestore.commit(player);
    },

    info: (player) => {
      return `Slam your target with holy power, dealing {bold ${damagePercent}%} weapon damage and reducing damage of the target's next attack by {bold ${reductionPercent}%}. Generates {bold {yellow ${favorAmount}}} Favor.`;
    }
  };
};
