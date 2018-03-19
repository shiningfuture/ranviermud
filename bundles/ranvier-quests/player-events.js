'use strict';

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      questStart: state => function (quest) {
        B.sayAt(this, `\r\n{bold {yellow Quest Started: ${quest.config.title}!}}`);
        if (quest.config.description) {
          B.sayAt(this, B.line(80));
          B.sayAt(this, `{bold {yellow ${quest.config.description}}}`, 80);
        }

        if (quest.config.rewards.length) {
          B.sayAt(this);
          B.sayAt(this, '{bold {yellow ' + B.center(80, 'Rewards') + '}}');
          B.sayAt(this, '{bold {yellow ' + B.center(80, '-------') + '}}');

          for (const reward of quest.config.rewards) {
            const rewardClass = state.QuestRewardManager.get(reward.type);
            B.sayAt(this, '  ' + rewardClass.display(state, quest, reward.config, this));
          }
        }

        B.sayAt(this, B.line(80));
      },

      questProgress: state => function (quest, progress) {
        B.sayAt(this, `\r\n{bold {yellow ${progress.display}}}`);
      },

      questTurnInReady: state => function (quest) {
        B.sayAt(this, `{bold {yellow ${quest.config.title} ready to turn in!}}`);
      },

      questComplete: state => function (quest) {
        B.sayAt(this, `{bold {yellow Quest Complete: ${quest.config.title}!}}`);

        if (quest.config.completionMessage) {
          B.sayAt(this, B.line(80));
          B.sayAt(this, quest.config.completionMessage);
        }
      },

      /**
       * Player received a quest reward
       * @param {object} reward Reward config _not_ an instance of QuestReward
       */
      questReward: state => function (reward) {
        // do stuff when the player receives a quest reward. Generally the Reward instance
        // will emit an event that will be handled elsewhere and display its own message
        // e.g., 'currency' or 'experience'. But if you want to handle that all in one
        // place instead, or you'd like to show some supplemental message you can do that here
      },
    }
  };
};

