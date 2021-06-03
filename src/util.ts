import { getHashDigest } from 'loader-utils';

export const name = 'MiniHtmlExtractPlugin';

/**
   * @param {string} formatter '[name].[ext]?[query]#[contenthash]'
   */
export function getFilename(formatter: string, { name = '', ext = '', query = '', content = Buffer.from('') }) {
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

// export const schema = {
//   type: 'object',
//   properties: {
//     filename: {
//       type: 'string',
//       default: '[name].html',
//     },
//     entries: {
//       type: 'array',
//     }
//   }
// };

export const filename = {
  name: /\[name\]/gi,
  ext: /\[ext\]/gi,
  contenthash: /\[contenthash\]/gi,
  query: /\[query\]/gi,
};

export const placeholder = {
  entryName: /\[entryName\]/gi,
  entryJsFilename: /\[entryJsFilename\]/gi,
};