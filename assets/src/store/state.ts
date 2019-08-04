import * as api from '../../../apiclient'
import { RouterState } from 'connected-react-router';

/**
 * Simple object that resolves to "data" and "loaded"
 * This class is immutable
 */
export class Loadable<T> {
    constructor(public data: T, public loaded=false) {}
}

export function loaded<T>(data : T) {
    return new Loadable<T>(data, true);
}

export interface PortfolioState {
    error: any

    /** 
     * Should be false when the application begins loading,
     * but should become true after a location change event.
     * This is used to ignore the first LOCATION_CHANGE event.
     */
    finishedInitialLoad: boolean

    currentPath: string

    article: Loadable<api.BlogEntry>
    
    articleList: Loadable<api.BlogEntry[]> 
}

/**
 * Defines a structure for the state of the application
 */
export interface AppState {
    router: RouterState,
    portfolio: PortfolioState
}

// todo: initialState from server should be finishedInitialLoad = false,
// but from client should be finishedInitialLoad = true. Come up with solution.


export const initialPortfolioState: PortfolioState = {
    error: null,
    finishedInitialLoad: false,
    currentPath: '',
    
    article: new Loadable(null),
    articleList: new Loadable(null)
}

/**
 * A constant initial state for the application.
 * All changes are mutations of this instance.
 */
export const initialState : AppState = {
    router: undefined,
    portfolio: initialPortfolioState
}
