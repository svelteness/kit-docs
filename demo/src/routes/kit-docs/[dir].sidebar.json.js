import { createSidebarRequestHandler, kebabToTitleCase } from '@svelteness/kit-docs/node';

export const GET = createSidebarRequestHandler({
  formatCategoryName: (dirname) => kebabToTitleCase(dirname).replace('Api', 'API'),
});
