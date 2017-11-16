import * as express from 'express';



/** Creates an express rule to match :idName-rest-of-url */
export const slugRouteRule = (idName) => `:${idName}(\\d+)(-[-0-9A-Za-z]+)?`;

