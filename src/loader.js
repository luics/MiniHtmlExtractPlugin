const path = require('path');
const fs = require('fs');
const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');
const Plugin = require('.');

function loader(source, map, meta) {
  const { tplPath, schema, placehold, getFilename, name } = Plugin;

  const options = getOptions(this);
  console.log('[options]', options);
  console.log('[source]', typeof source, source instanceof Buffer);
  // console.log('[options]', this);
  const resource = path.parse(this.resource);
  validateOptions(Plugin.schema, options, Plugin.name + '.loader');

  let webapckConfigPath = path.join(process.cwd(), 'webpack.config.js');
  const index = process.argv.indexOf('--config');
  if (index > -1) webapckConfigPath = path.join(process.cwd(), process.argv[index + 1]);
  const webapck = require(webapckConfigPath);

  let buildDir = path.join(process.cwd(), `./build/`);
  let entryJsFilename = `[contenthash].js`;
  if (webapck.output) {
    if (webapck.output.path) buildDir = webapck.output.path;
    if (webapck.output.filename) entryJsFilename = webapck.output.filename;
  }
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

  entryJsFilename = getFilename(entryJsFilename, { name: resource.name, ext: resource.ext, content: source });
  const entryHtml = fs.readFileSync(tplPath).toString().replace(placehold.title, resource.name).replace(placehold.scriptSrc, entryJsFilename);
  const entryHtmlFilename = getFilename(options.filename || schema.properties.filename.default, { name: resource.name, ext: 'html', content: entryHtml });
  fs.writeFileSync(path.join(buildDir, entryHtmlFilename), entryHtml);

  this.callback(null, source, map, meta);
  return;
};

module.exports = loader;
module.exports.raw = true;