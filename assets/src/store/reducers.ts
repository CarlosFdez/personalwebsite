import { AppState, loaded, initialState } from './core';

// this is from react-router-redux and is used when a new page loads
const LOCATION_CHANGED = '@@router/LOCATION_CHANGE';

// a version of the initial state for post loaded states
const loadedInitialState = { ...initialState, finishedInitialLoad: true}

// todo: Split this up if this gets big (can't use combine reducers, it forces a structure)
export const reducer = (state=initialState, action) : AppState => {
    console.log(action);
    switch (action.type) {
        case LOCATION_CHANGED:
            if (!state.finishedInitialLoad) {
                // ignore location change on the first attempt
                return {...state, finishedInitialLoad: true};
            }

             // clear when a page loads, but set finished to true
            return loadedInitialState;
        case "ERROR":
            return { ...state, error: action.data };
        case "ARTICLE_LIST_LOADED":
            return { ...state, articleList: loaded(action.data) };
        case "ARTICLE_LOADED":
            return { ...state, article: loaded(action.data) };
        default: 
            return state;
    }
}