const fs = require('fs');
const path = require('path');

function addHook(compiler, pluginName, hookName, hook) {
  if ('hooks' in compiler) {
    compiler.hooks[hookName].tap(pluginName, hook);
  } else {
    compiler.plugin(hookName, hook);
  }
}

function WebpackTouch(options) {
  this.options = options || {};
  if (!this.options.filename) {
    throw new Error('Require filename option');
  }
}

WebpackTouch.prototype.apply = function (compiler) {
  options = this.options;

  addHook(compiler, 'WebpackTouch', 'done', function (stats) {
    if (options.ignoreOnError && stats.hasErrors()) {
      console.log('Not touch on error');
      return;
    }
    if (options.delay) {
      setTimeout(touch, options.delay);
    } else {
      touch();
    }
  });

  function touch() {
    try {
      if (fs.existsSync(options.filename)) {
        const now = new Date();
        fs.utimesSync(options.filename, now, now);
      } else {
        fs.writeFileSync(options.filename, '');
      }
    } catch (e) {
      console.error(err)
    }
  }
};

module.exports = WebpackTouch;
