import { createSidebarRequestHandler, kebabToTitleCase } from '@svelteness/kit-docs/node';

export const get = createSidebarRequestHandler({
  formatCategoryName: (dirname) => kebabToTitleCase(dirname).replace('Api', 'API'),
});
