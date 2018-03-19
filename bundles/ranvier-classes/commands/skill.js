'use strict';

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const SkillFlag = require(srcPath + 'SkillFlag');

  return {
    aliases: [ "spell" ],
    command : state => (args, player) => {
      const say = (message, wrapWidth) => B.sayAt(player, message, wrapWidth);

      if (!args.length) {
        return say("What skill or spell do you want to look up? Use 'skills' to view all skills/spells.");
      }

      let skill = state.SkillManager.find(args, true);
      if (!skill) {
        skill = state.SpellManager.find(args, true);
      }

      if (!skill) {
        return say("No such skill.");
      }

      say('{bold ' + B.center(80, skill.name, 'white', '-') + '}');
      if (skill.flags.includes(SkillFlag.PASSIVE)) {
        say('{bold Passive}');
      } else {
        say(`{bold Usage}: ${skill.id}`);
      }

      if (skill.resource.cost) {
        say(`{bold Cost}: {bold ${skill.resource.cost}} ${skill.resource.attribute}`);
      }

      if (skill.cooldownLength) {
        say(`{bold Cooldown}: {bold ${skill.cooldownLength}} seconds`);
      }
      say(skill.info(player), 80);
      say('{bold ' + B.line(80) + '}');
    }
  };
};


