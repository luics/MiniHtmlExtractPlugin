// import validateOptions from 'schema-utils';
import fs from 'fs';
import { compiler, compilation } from 'webpack';
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

  // TODO: [support splitChunk](https://webpack.js.org/plugins/split-chunks-plugin/#split-chunks-example-1)
  apply(compiler: compiler.Compiler) {
    compiler.hooks.emit.tapAsync(name, (compilation: compilation.Compilation, callback) => {
      const compilationEntries = Object.keys((compilation as any).options.entry);
      let entries = this.entries;
      if (!entries.length) entries = compilationEntries;
      else {
        entries.forEach(entry => {
          if (!compilationEntries.includes(entry)) throw new Error(`'${entry}' not exists in webpack config`);
        });
      }

      Object.keys(compilation.assets).forEach(assetKey => {
        // TODO: match output.filename
        let entry = entries?.find(entry => assetKey.startsWith(`${entry}.js`)); 
        if (!entry) return;

        let html = this.template
          .replace(placeholder.entryName, entry)
          .replace(placeholder.entryJsFilename, assetKey);

        Object.keys(this.placeholder).forEach(key => {
          html = html.replace(new RegExp(`\\[${key}\\]`, 'gi'), this.placeholder[key]);
        });

        const htmlFilename = getFilename(this.filename, { name: entry, ext: 'html', content: Buffer.from(html) });
        compilation.assets[htmlFilename] = { source: () => html, size: () => html.length };
      });

      callback();
    });
  }

}