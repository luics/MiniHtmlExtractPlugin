import { getHashDigest } from 'loader-utils';
// import { Schema } from 'schema-utils/declarations/validate';

export const name = 'MiniHtmlExtractPlugin';


export type Options = { filename?: string, entries?: string[] };

/**
   * @param {string} formatter '[name].[ext]?[query]#[contenthash]'
   */
export function getFilename(formatter: string, { name = '', ext = '', query = '', content = new Buffer('') }) {
  let contenthash = '';
  if (content && filename.contenthash.test(formatter)) {
    contenthash = getHashDigest(content, 'md4', 'hex', 9999);
  }

  return formatter
    .replace(filename.name, name)
    .replace(filename.ext, ext)
    .replace(filename.query, query)
    .replace(filename.contenthash, contenthash)
    ;
};

export const schema = {
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

export const filename = {
  name: /\[name\]/gi,
  ext: /\[ext\]/gi,
  contenthash: /\[contenthash\]/gi,
  query: /\[query\]/gi,
};

export const placehold = {
  title: /\[title\]/gi,
  scriptSrc: /\[script-src\]/gi,
};