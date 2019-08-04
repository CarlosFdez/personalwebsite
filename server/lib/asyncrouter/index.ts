import * as t from './types';
import { Router, RequestHandler } from 'express';

export * from './types';

/**
 * Wraps an asynchronous request handler, transforming it to a synchronous one.
 * This catches uncaught errors from the async one and calls next(err).
 * Not necessary if using an AsyncRouter.
 */
export function wrapHandler(fn: t.AsyncAnyHandler) : RequestHandler {
    return (...args) => {
        let promise = (fn as any)(...args);
        let next = args[2];
        if (promise) { 
            promise.catch((err) => next(err));
        }
    }
}

/**
 * Returns a wrapper over an express Router that supports asynchronous handlers.
 * @param options 
 */
export function AsyncRouter(options?) : t.AsyncRouter {
    let base = Router(options);
    for (let key in asyncMethods) {
        base[key] = asyncMethods[key];
    }
    return base as t.AsyncRouter;
}

function wrapHandlers(handlers : t.AsyncAnyHandler[]) {
    return handlers.map(f => wrapHandler(f));
}

// methods to be added through the proxy
let asyncMethods : Partial<t.AsyncRouter> = {
    getAsync(path, ...handlers : t.AsyncRequestHandler[]) {
        return this.get(path, ...wrapHandlers(handlers));
    },

    postAsync(path, ...handlers : t.AsyncRequestHandler[]) {
        return this.post(path, ...wrapHandlers(handlers));
    },

    useAsync(...args) {
        if (args.length == 0) {
            return this.use();
        }

        if (args[0] instanceof Function) {
            return this.use(...wrapHandlers(args));
        }
        
        return this.use(args[0], ...wrapHandlers(args.splice(1)));
    }
}
