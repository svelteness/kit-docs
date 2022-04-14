import { createHash } from 'crypto';

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleToSnakeCase(str: string) {
  return str.replace(/([A-Z]|[1-9])/g, (x) => '_' + x[0].toLowerCase()).slice(1);
}

export function kebabToTitleCase(str: string) {
  return uppercaseFirstLetter(str.replace(/-./g, (x) => ' ' + x[1].toUpperCase()));
}

export function hashString(str: string) {
  return createHash('sha256').update(str).digest('hex');
}
