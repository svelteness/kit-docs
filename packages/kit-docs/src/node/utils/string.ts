export function titleToKebabCase(str: string) {
  return str.replace(/([A-Z]|[1-9])/g, (x) => '-' + x[0].toLowerCase()).slice(1);
}
