import { createSidebarRequestHandler } from '../../../node/handlers';

export const GET = createSidebarRequestHandler((x) => new Response(x));
