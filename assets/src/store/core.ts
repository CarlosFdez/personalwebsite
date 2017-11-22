// core data types defined for store purposes
// todo: this could maybe use some organizing

import * as api from '../../../apiclient'

/**
 * Simple object that resolves to "data" and "loaded"
 */
export class Loadable<T> {
    constructor(public data: T, public loaded=false) {}
}

export function loaded<T>(data : T) {
    return new Loadable<T>(data, true);
}

/**
 * Defines a structure for the state of the application
 */
export class AppState {
    error = null

    /** 
     * Should be false when the application begins loading,
     * but should become true after a location change event.
     * This is used to ignore the first LOCATION_CHANGE event.
     */
    finishedInitialLoad = false

    article = new Loadable<api.BlogEntry>(null)
    
    articleList = new Loadable<api.BlogEntry[]>([])
}

/**
 * A constant initial state for the application.
 * All changes are mutations of this instance.
 */
export const initialState = new AppState();