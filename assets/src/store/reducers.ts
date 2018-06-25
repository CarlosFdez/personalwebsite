import { loaded, initialState, AppState } from './state'
import { animatedScrollTo } from '../js/scroll'
import { RouterState } from 'connected-react-router';

// this is from react-router-redux and is used when a new page loads
const LOCATION_CHANGED = '@@router/LOCATION_CHANGE';

// todo: Split this up if this gets big (can't use combine reducers, it forces a structure)
export const reducer = (state=initialState, action) : AppState => {
    switch (action.type) {
        case LOCATION_CHANGED:
            let payload = action.payload as RouterState;
            let path : string = payload.location.pathname;

            // if the path is the same, perform a scroll to top
            if (path == state.currentPath) {
                animatedScrollTo(0, 0.1);
            }

            // If we're navigating to a new page, scroll to top
            if (payload.action == "PUSH") {
                window.scrollTo(0, 0);
            }

            // restore initial state whenever a page loads
            return { ...initialState, currentPath: path };

        case "ERROR":
            // todo: check that we were on the page that created the error
            return { ...state, error: action.data };

        case "ARTICLE_LIST_LOADED":
            return { ...state, articleList: loaded(action.data) };

        case "ARTICLE_LOADED":
            return { ...state, article: loaded(action.data) };

        default: 
            return state;
    }
}