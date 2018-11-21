import { loaded, initialState, AppState } from './state'
import { animatedScrollTo } from '../js/scroll'
import { RouterState } from 'connected-react-router';
import { ActionTypes } from './actions';

// todo: Split this up if this gets big (can't use combine reducers, it forces a structure)
export const reducer = (state=initialState, action) : AppState => {
    switch (action.type) {
        case ActionTypes.INITIALIZED:
            return { ...state, finishedInitialLoad: true };
        
        case ActionTypes.LOCATION_CHANGED:
            let payload = action.payload as RouterState;
            let path : string = payload.location.pathname;

            // If initial load hasn't finished, update the path and nothing else.
            if (!state.finishedInitialLoad) {
                return { ...state, currentPath: path };
            }

            // if the path is the same, perform a scroll to top
            if (path == state.currentPath) {
                animatedScrollTo(0, 0.1);
            }

            // If we're navigating to a new page, scroll to top
            if (payload.action == "PUSH") {
                window.scrollTo(0, 0);
            }

            // restore initial state whenever a page loads
            // We must also set finished initial load in this scenario
            return {
                ...initialState, 
                currentPath: path,
                finishedInitialLoad: true };

        case ActionTypes.ERROR:
            // todo: check that we were on the page that created the error
            return { ...state, error: action.data };

        case ActionTypes.ARTICLE_LIST_LOADED:
            return { ...state, articleList: loaded(action.data) };

        case ActionTypes.ARTICLE_LOADED:
            return { ...state, article: loaded(action.data) };

        default: 
            return state;
    }
}