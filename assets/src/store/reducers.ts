import { loaded, initialState, AppState } from './state'
import { animatedScrollTo } from '../js/scroll'

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

            let path : string = action.payload.pathname;

            // if the path is the same, also perform a scroll to top
            if (path == state.currentPath) {
                animatedScrollTo(0, 0.1);
            }

             // clear when a page loads, but set finished to true
            return { ...loadedInitialState, currentPath: path };

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