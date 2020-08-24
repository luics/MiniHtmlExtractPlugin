// import validateOptions from 'schema-utils';
import fs from 'fs';
import webpack, { compiler, compilation } from 'webpack';
import { name, placeholder, getFilename } from './util';
import defaultTemplate from './index.html';

export default class Plugin {

  constructor({
    filename = '[name].html',
    entries = [],
    template = defaultTemplate,
    templatePath = '',
    placeholder = {},
  } = {}) {
    this.filename = filename;
    this.entries = entries;
    this.template = template;
    this.templatePath = templatePath;
    this.placeholder = placeholder;
    if (this.templatePath) this.template = fs.readFileSync(this.templatePath).toString();
    // validateOptions(schema, options);
  }

  filename: string;
  entries: string[];
  template: string;
  templatePath: string;
  placeholder: { [key: string]: string };

  apply(compiler: compiler.Compiler) {
    compiler.hooks.emit.tapAsync(name, (compilation: compilation.Compilation, callback) => {
      const options = (compilation as any).options as webpack.Configuration;
      if (!options.entry) return;
      const compilationEntries = Object.keys(options.entry);
      let entries = this.entries;
      if (!entries.length) entries = compilationEntries;
      else {
        entries.forEach(entry => {
          if (!compilationEntries.includes(entry)) throw new Error(`'${entry}' not exists in webpack config`);
        });
      }

      Object.keys(compilation.assets).forEach(assetKey => {
        let entry = entries?.find(entry => {
          const re = new RegExp(`(^|\/)${entry}.js`);
          return re.test(assetKey);
          // assetKey.indexOf(re) >= 0
        });
        if (!entry) return;

        const jsPath = (options.output?.publicPath ?? '') + assetKey;
        let html = this.template
          .replace(placeholder.entryName, entry)
          .replace(placeholder.entryJsFilename, jsPath);

        Object.keys(this.placeholder).forEach(key => {
          html = html.replace(new RegExp(`\\[${key}\\]`, 'gi'), this.placeholder[key]);
        });

        const htmlFilename = getFilename(this.filename, { name: entry, ext: 'html', content: Buffer.from(html) });
        // console.log(htmlFilename);
        compilation.assets[htmlFilename] = { source: () => html, size: () => html.length };
      });

      callback();
    });
  }

}