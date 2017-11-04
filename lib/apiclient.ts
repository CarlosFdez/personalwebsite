import "isomorphic-fetch";

/**
 * A wrapper over fetch that throws an exception if the response is not ok.
 * @param input 
 * @param init 
 */
async function fetchHandled(input: RequestInfo, init?: RequestInit) {
    let response = await fetch(input, init);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

export default class ApiClient {
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

    async getBlogBriefs() {
        return await this.fetchJson("/api/blog");
    }

    async getBlogArticle(id : string) {
        return await this.fetchJson(`/api/blog/${id}`);
    }
}