// import validateOptions from 'schema-utils';
import { compiler, compilation } from 'webpack';
import { Options, name, schema, placehold, getFilename } from './util';
import tpl from './index.html';

export default class Plugin {

  constructor(public options: Options) {
    if (!options.filename) options.filename = schema.properties.filename.default;
    if (!options.entries) options.entries = [];
    // validateOptions(schema, options);
  }

  apply(compiler: compiler.Compiler) {
    compiler.hooks.emit.tapAsync(name, (compilation: compilation.Compilation, callback) => {
      const compilationEntries = Object.keys((compilation as any).options.entry);
      let entries = this.options.entries;
      if (!entries) entries = compilationEntries;
      else {
        entries.forEach(entry => {
          if (!compilationEntries.includes(entry)) throw new Error(`'${entry}' not exists in webpack config`);
        });
      }

      Object.keys(compilation.assets).forEach(assetKey => {
        let entry = entries?.find(entry => assetKey.startsWith(`${entry}.js`));
        if (!entry) return;

        const entryJsFilename = assetKey;
        const html = tpl
          .replace(placehold.title, entry)
          .replace(placehold.scriptSrc, entryJsFilename);
        const entryHtmlFilename = getFilename(
          this.options.filename || schema.properties.filename.default,
          { name: entry, ext: 'html', content: Buffer.from(html) }
        );

        compilation.assets[entryHtmlFilename] = { source: () => html, size: () => html.length };
      });

      callback();
    });
  }

}