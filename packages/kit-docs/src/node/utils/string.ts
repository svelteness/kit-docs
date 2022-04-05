export function titleToSnakeCase(str: string) {
  return str.replace(/([A-Z]|[1-9])/g, (x) => '_' + x[0].toLowerCase()).slice(1);
}
