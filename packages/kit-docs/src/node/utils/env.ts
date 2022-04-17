import { readFileSync } from 'fs';
import { resolve } from 'path';

import { isUndefined } from './unit';

let isLocal;
export function isLocalEnv() {
  if (!isUndefined(isLocal)) return isLocal;

  try {
    const pkgPath = resolve(process.cwd(), 'package.json');
    if (pkgPath.endsWith('kit-docs/package.json')) {
      const pkg = readFileSync(pkgPath).toString();
      if (/"name": "@svelteness\/kit-docs"/.test(pkg)) {
        isLocal = true;
        return true;
      }
    }
  } catch (e) {
    //  no-op
  }

  isLocal = false;
  return false;
}
