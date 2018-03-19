'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');
  const Config = require(srcPath + 'Config');

  return  {
    listeners: {
      commandQueued: state => function (commandIndex) {
        const command = this.commandQueue.queue[commandIndex];
        const ttr = sprintf('%.1f', this.commandQueue.getTimeTilRun(commandIndex));
        Broadcast.sayAt(this, `{bold {yellow Executing} '{white ${command.label}}' {yellow in} {white ${ttr}} {yellow seconds.}`);
      },

      updateTick: state => function () {
        if (this.commandQueue.hasPending && this.commandQueue.lagRemaining <= 0) {
          Broadcast.sayAt(this);
          this.commandQueue.execute();
          //Broadcast.prompt(this);
        }

        const lastCommandTime = this._lastCommandTime || Infinity;
        const timeSinceLastCommand = Date.now() - lastCommandTime;
        const maxIdleTime = (Math.abs(Config.get('maxIdleTime')) * 60000) || Infinity;

        if (timeSinceLastCommand > maxIdleTime) {
          this.save(() => {
            Broadcast.sayAt(this, `You were kicked for being idle for more than ${maxIdleTime / 60000} minutes!`);
            Broadcast.sayAtExcept(this.room, `${this.name} disappears.`, this);
            Logger.log(`Kicked ${this.name} for being idle.`);
            this.socket.emit('close');
          });
        }
      },
    }
  };
};
