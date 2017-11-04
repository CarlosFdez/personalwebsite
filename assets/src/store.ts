/**
 * Contains and manages global data for the application.
 * I could switch to managing this with Redux if I ever find the need to
 */

class Store {
    blogArticles: object[]
    blogArticle: object
}

let store : Store;

/**
 * Creates a new store and returns it.
 * Use this only during bootstrapping or server side.
 */
export const createStore = (initialData? : object) => {
    store = new Store();
    for (var key in initialData) {
        store[key] = initialData[key];
    }
    return store;
}

/**
 * Returns the current existing store, creating a new one if it doesn't exist.
 * Use this one in the views.
 */
export const getStore = () => {
    if (store)
    return store;
}