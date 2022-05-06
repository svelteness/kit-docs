import { normalizePath } from '@rollup/pluginutils';
import { createHash } from 'crypto';
import { createReadStream, readdirSync, statSync } from 'fs';
import LRUCache from 'lru-cache';
import { resolve } from 'path';

export function checksumFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(path);
    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

const ignoreFileRE = /^(\.|_)/;
export function readDirDeepSync(dir: string, options: { maxDepth?: number; _depth?: number } = {}) {
  const depth = options._depth ?? 0;

  if (depth === options.maxDepth) return [];

  const files: string[] = [];

  for (const file of readdirSync(dir)) {
    const filePath = resolve(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      files.push(
        ...readDirDeepSync(filePath, {
          ...options,
          _depth: depth + 1,
        }),
      );
    } else if (!ignoreFileRE.test(file)) {
      files.push(normalizePath(filePath));
    }
  }

  return files;
}

const fileOrderRE = /\[\.\.\.(\d*?)(_|=|\])/;
const sortFilesCache = new LRUCache<string, number>({ max: 1024 });
export function sortOrderedFiles(files: string[]) {
  return files.sort((fileA, fileB) => {
    const cacheKey = fileA + fileB;
    const cache = (result: number) => sortFilesCache.set(cacheKey, result);

    if (sortFilesCache.has(cacheKey)) {
      return sortFilesCache.get(cacheKey)!;
    }

    const tokensA = fileA.split('/').slice(1);
    const tokensB = fileB.split('/').slice(1);

    const len = Math.max(tokensA.length, tokensB.length);

    for (let i = 0; i < len; i++) {
      if (!(i in tokensA)) {
        cache(-1);
        return -1;
      }

      if (!(i in tokensB)) {
        cache(1);
        return 1;
      }

      const tokenA = tokensA[i].toLowerCase();
      const tokenB = tokensB[i].toLowerCase();

      const tokenAOrderNo = tokensA[i].match(fileOrderRE)?.[1];
      const tokenBOrderNo = tokensB[i].match(fileOrderRE)?.[1];

      if (tokenAOrderNo && tokenBOrderNo) {
        const result = parseInt(tokenAOrderNo) - parseInt(tokenBOrderNo);
        if (result !== 0) {
          cache(result);
          return result;
        }
      }

      if (tokenA === tokenB) {
        continue;
      }

      const isTokenADir = tokenA[tokenA.length - 1] === '/';
      const isTokenBDir = tokenB[tokenB.length - 1] === '/';

      let result;

      if (isTokenADir === isTokenBDir) {
        result = tokenA < tokenB ? -1 : 1;
      } else {
        result = isTokenADir ? 1 : -1;
      }

      cache(result);
      return result;
    }

    cache(0);
    return 0;
  });
}
