export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function kebabToTitleCase(str?: string) {
  return uppercaseFirstLetter(str?.replace(/-./g, (x) => ' ' + x[1].toUpperCase()) ?? '');
}

export function titleToKebabCase(str?: string) {
  return str?.replace(/\s/g, '-').toLowerCase() ?? '';
}
