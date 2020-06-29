const path = require('path');
const fs = require('fs');
const { getOptions, getHashDigest } = require('loader-utils');
const validateOptions = require('schema-utils');

class Plugin {

  constructor(options = {}) {
    validateOptions(Plugin.schema, options, Plugin.name);
    this.options = options;
    this.tpl = fs.readFileSync(Plugin.tplPath).toString();
  }

  apply(compiler) {
    const { schema, placehold, getFilename } = Plugin;

    compiler.hooks.emit.tapAsync(Plugin.name, (compilation, callback) => {
      const compilationEntries = Object.keys(compilation.options.entry);
      let entries = this.options.entries;
      if (!entries) entries = compilationEntries;
      else {
        entries.forEach(entry => {
          if (!compilationEntries.includes(entry)) throw new Error(`'${entry}' not exists in webpack config`);
        });
      }

      Object.keys(compilation.assets).forEach(assetKey => {
        let entry = entries.find(entry => assetKey.startsWith(`${entry}.js`));
        if (!entry) return;

        const entryJsFilename = assetKey;
        const html = this.tpl
          .replace(placehold.title, entry)
          .replace(placehold.scriptSrc, entryJsFilename);
        const entryHtmlFilename = getFilename(
          this.options.filename || schema.properties.filename.default,
          { name: entry, ext: 'html', content: html }
        );

        compilation.assets[entryHtmlFilename] = { source: () => html, size: () => html.length };
      });

      callback();
    });
  }

}

Plugin.name = 'MiniHtmlExtractPlugin';

/**
   * @param {string} formatter '[name].[ext]?[query]#[contenthash]'
   * @param {object} param1 
   * @param {string?} param1.name
   * @param {string?} param1.ext 
   * @param {string?} param1.content 
   * @param {string?} param1.query 
   */
Plugin.getFilename = (formatter, { name = '', ext = '', content = '', query = '' }) => {
  const filename = Plugin.filename;
  let contenthash = '';
  if (content && filename.contenthash.test(formatter)) {
    contenthash = getHashDigest(content);
  }

  return formatter
    .replace(filename.name, name)
    .replace(filename.ext, ext)
    .replace(filename.query, query)
    .replace(filename.contenthash, contenthash)
    ;
};

Plugin.schema = {
  type: 'object',
  properties: {
    filename: {
      type: 'string',
      default: '[name].html',
    },
    entries: {
      type: 'array',
    }
  }
};

Plugin.filename = {
  name: /\[name\]/gi,
  ext: /\[ext\]/gi,
  contenthash: /\[contenthash\]/gi,
  query: /\[query\]/gi,
};

Plugin.placehold = {
  title: /\[title\]/gi,
  scriptSrc: /\[script-src\]/gi,
};


Plugin.tplPath = path.join(__dirname, './index.html');

module.exports = Plugin;