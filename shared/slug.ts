/** 
 * Creates a slug url from a group of components, Uri encoded.
 * If you give it "2" and "Hello there", it returns "2-hello-there".
 * */
export function createSlug(...items: string[]) {
    return encodeURIComponent(items.map(
        (i) => i.toLowerCase().replace(/("|')/, "").replace(" ", "-")
    ).join('-'));
}

/**
 * Extracts the first portion of a slug string
 */
export function getIdFromSlug(slug: string) {
    let [idStr, ..._] = slug.split('-', 1);
    return idStr;
}

/**
 * Extracts the first portion of a slug string, removing leading 0s
 * and parsing to an integer. This is mostly a server side function
 * @param slug
 */
export function getIntIdFromSlug(slug : string) {
    let idStr = getIdFromSlug(slug);
    idStr = idStr.replace(/^0+/, '');
    return parseInt(idStr)
}