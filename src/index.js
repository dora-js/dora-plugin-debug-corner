import 'babel-polyfill';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'url';
import { join } from 'path';

let debugCorner = '';

export default {
  'middleware'() {
    const cwd = this.cwd;
    return function* (next) {
      const fileName = parse(this.url).pathname;

      if (fileName === '/dora-plugin-debug-corner.js') {
        if (!debugCorner) {
          debugCorner = readFileSync(join(cwd, './node_modules/dora-plugin-debug-corner/component/', fileName), 'utf-8');
        }
        this.body = debugCorner;

        return;
      }

      const filePath = join(cwd, fileName);
      const isHTML = /\.html?$/.test(this.url.split('?')[0]);
      if (isHTML && existsSync(filePath)) {
        const injectScript = '<script src="./dora-plugin-debug-corner.js"></script>';
        let content = readFileSync(filePath, 'utf-8');
        const docTypeReg = new RegExp('^\s*\<\!DOCTYPE\s*.+\>.*$', 'im');
        const docType = content.match(docTypeReg);
        if (docType) {
          content = content.replace(docTypeReg, docType[0] + injectScript);
          this.body = content;

          return;
        }
        content = injectScript + content;

        return;
      }
      yield next;
    };
  },
};
