'use strict';

module.exports = {
  async check(ctx) {
    ctx.body = {
      status: 'ok',
      time: new Date().toISOString(),
    };
  },
};
