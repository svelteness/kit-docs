import { basename, extname } from 'path';

export function getFileNameFromPath(filePath: string) {
  return basename(filePath, extname(filePath));
}
