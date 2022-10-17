import { createMetaRequestHandler } from '../../../node/handlers';

export const GET = createMetaRequestHandler((x) => new Response(x));
