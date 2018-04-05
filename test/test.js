const fs = require('fs');
const path = require('path');
const assert = require('assert');
const webpack = require('webpack');
const WebpackTouch = require('..');

const touchedFile = path.resolve(__dirname, './dist/touched.file');
const config = require('./webpack.config');
const defaultConfig = Object.assign({}, config, {
  plugins: [
    new WebpackTouch({
      filename: touchedFile,
    }),
  ],
});


const runWebpack = (options) => {
  return new Promise((resolve, reject) => {
    webpack(options, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats);
    });
  });
};

const removeTouchedFile = () => {
  if (fs.existsSync(touchedFile)) {
    fs.unlinkSync(touchedFile);
  }
};

describe('WebpackTouchPlugin', () => {
  before(removeTouchedFile);
  after(removeTouchedFile);

  it(`${touchedFile} not created yet (just to be sure)`, () => {
    assert.ok(!fs.existsSync(touchedFile), `${touchedFile} does not exist`);
  });

  it(`creates ${touchedFile}`, () => {
    return runWebpack(defaultConfig)
      .then(() => {
        assert.ok(fs.existsSync(touchedFile), `${touchedFile} exists`);
      });
  });

  it(`updates ${touchedFile} ctime`, () => {
    const ctime = fs.statSync(touchedFile).ctime;
    return runWebpack(defaultConfig)
      .then(() => {
        assert.notEqual(ctime, fs.statSync(touchedFile).ctime);
      });
  });

  it(`triggers fn.watch listening on ${touchedFile}`, () => {
    return Promise.all([
      runWebpack(defaultConfig),
      new Promise((resolve) => {
        const watcher = fs.watch(touchedFile);
        watcher.on('change', () => {
          watcher.close();
          resolve();
        });
      })
    ]);
  });
});
