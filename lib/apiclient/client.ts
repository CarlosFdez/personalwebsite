import "isomorphic-fetch";

import * as types from './types';

export class HttpError extends Error {
    constructor(message : string, public statusCode : number) {
        super(message)
        Error.captureStackTrace(this, HttpError);
    }
}

/**
 * A wrapper over fetch that throws an exception if the response is not ok.
 * @param input 
 * @param init 
 */
async function fetchHandled(input: RequestInfo, init?: RequestInit) {
    let response = await fetch(input, init);
    if (!response.ok) {
        throw new HttpError(response.statusText, response.status);
    }
    return response;
}


export class ApiClient {
    constructor(private basePath : string) {}

    private pathTo(subPath) {
        var path = this.basePath.replace(/(\/)$/, "")
        path += "/";
        path += subPath.replace(/^(\/)/, "");
        return path;
    }

    private async fetchJson(subPath) {
        let res = await fetchHandled(this.pathTo(subPath));
        return await res.json();
    }

    async getBlogBriefs() : Promise<types.BlogEntryBrief[]> {
        let res = await this.fetchJson("/api/blog/");
        return res.items;
    }

    async getBlogArticle(id : string) : Promise<types.BlogEntry> {
        let res = await this.fetchJson(`/api/blog/${id}`);
        return res.item;
    }
}