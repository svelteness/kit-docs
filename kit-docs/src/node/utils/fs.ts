import { normalizePath } from '@rollup/pluginutils';
import { createHash } from 'crypto';
import { createReadStream, readdirSync, statSync } from 'fs';
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
