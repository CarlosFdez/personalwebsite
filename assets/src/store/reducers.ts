import { AppState, loaded, initialState } from './core';

// todo: Split this up if this gets big (can't use combine reducers, it forces a structure)
export const reducer = (state=initialState, action) : AppState => {
    switch (action.type) {
        case "ERROR":
            return { ...state, error: action.data };
        case "ARTICLE_LIST_LOADED":
            return { ...state, articleList: loaded(action.data) };
        case "ARTICLE_LOADED":
            return { ...state, article: loaded(action.data) };
    }

    return state;
}