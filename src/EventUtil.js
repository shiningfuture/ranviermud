'use strict';

const chalk = require('chalk');

/**
 * Helper methods for colored output during input-events
 */
class EventUtil {
  /**
   * Generate a function for writing colored output to a socket
   * @param {net.Socket} socket
   * @return {function (string)}
   */
  static genWrite(socket) {
    return string => socket.write(chalk`${string}`);
  }

  /**
   * Generate a function for writing colored output to a socket with a newline
   * @param {net.Socket} socket
   * @return {function (string)}
   */
  static genSay(socket) {
    return string => socket.write(chalk`${string}\r\n`);
  }
}

module.exports = EventUtil;
