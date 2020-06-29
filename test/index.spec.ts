import fs from 'fs';
import path from 'path';
import 'mocha';
import assert from 'assert';

describe('Plugin', () => {

  const entries = ['app', 'subapp'];
  const buildPath = path.resolve(__dirname, '../build');

  it('html file exists', () => {
    entries.forEach(entry => {
      assert.ok(fs.existsSync(path.resolve(buildPath, `${entry}.html`)));
    });
  });

});