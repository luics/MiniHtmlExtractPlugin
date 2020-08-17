import fs from 'fs';
import path from 'path';
import 'mocha';
import assert from 'assert';

describe('Plugin', () => {

  const buildPath = path.resolve(__dirname, '../build');
  const templateRe = /^<html><body>app<div id=\"root\"><\/div><script src=\"(https:\/\/cdn\.com\/)?app.js\?(.+?)\"><\/script><\/body><\/html>$/;

  it('empty params', () => {
    assert.ok(fs.existsSync(path.resolve(buildPath, 'app.html')));
    assert.ok(fs.existsSync(path.resolve(buildPath, 'subapp.html')));
    assert.ok(fs.existsSync(path.resolve(buildPath, 'main.html')));
  });

  it('filename', () => {
    assert.ok(fs.existsSync(path.resolve(buildPath, 'app-filename.html')));
  });

  it('template', () => {
    const p = path.resolve(buildPath, 'app-template.html');
    assert.ok(fs.existsSync(p));
    assert.ok(templateRe.test(fs.readFileSync(p).toString()));
  });

  it('template placeholder', () => {
    const p = path.resolve(buildPath, 'app-template-placeholder.html');
    assert.ok(fs.existsSync(p));
    assert.ok(templateRe.test(fs.readFileSync(p).toString()));
  });

  it('templatePath', () => {
    const p = path.resolve(buildPath, 'app-templatePath.html');
    assert.ok(fs.existsSync(p));
    assert.ok(templateRe.test(fs.readFileSync(p).toString()));
  });

  it('templatePath placeholder', () => {
    const p = path.resolve(buildPath, 'app-templatePath-placeholder.html');
    assert.ok(fs.existsSync(p));
    assert.ok(templateRe.test(fs.readFileSync(p).toString()));
  });

});