import { 
    Request, 
    Response, 
    NextFunction, 
    Router, 
    RequestHandler, 
    ErrorRequestHandler
} from 'express';

import { PathParams } from 'express-serve-static-core';

/**
 * Represents an express handler that is asynchronous
 */
export interface AsyncRequestHandler {
    (req: Request, res : Response, next: NextFunction): Promise<any>;
}

/**
 * Represents an express error handler that is asynchronous
 */
export interface AsyncErrorRequestHandler {
    (err: any, req: Request, res : Response, next: NextFunction): Promise<any>;
}

// a union type which maps to either type
export type AsyncAnyHandler = AsyncRequestHandler | AsyncErrorRequestHandler;

export interface AsyncRouter extends Router {
    getAsync(path : PathParams, ...handlers : AsyncRequestHandler[]);
    getAsync(path : PathParams, ...handlers : AsyncAnyHandler[]);

    postAsync(path : PathParams, ...handlers : AsyncAnyHandler[]);
    
    useAsync(...handlers : AsyncAnyHandler[]);
    useAsync(path: PathParams, ...handlers : AsyncAnyHandler[]);
}
