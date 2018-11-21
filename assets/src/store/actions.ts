import { ApiClient, HttpError } from '../../../apiclient'
import { ThunkAction } from 'redux-thunk';
import { AppState } from './state';
import { Action } from 'redux';
var api = new ApiClient('/');

/**
 * String constants for action types. 
 * The type argument in any action result must be one of these.
 */
export const ActionTypes = Object.freeze({
    // this is from react-router-redux and is used when a new page loads
    LOCATION_CHANGED: '@@router/LOCATION_CHANGE',
    ERROR: 'ERROR',
    INITIALIZED: 'INITIALIZED',

    ARTICLE_LIST_LOADED: 'ARTICLE_LIST_LOADED',
    ARTICLE_LOADED: 'ARTICLE_LOADED'
})

/**
 * An action used when there has been any sort of error
 * @param err Error data or message in console.error(). Can also be an HttpError object.
 */
export function error(err: HttpError | any) {
    console.error(err);
    return {
        type: ActionTypes.ERROR,
        data: err
    }
}

type AsyncAction = ThunkAction<Promise<void>, AppState, void, any>;

/**
 * An action that when dispatched notifies the system that initialization has complete.
 * The initialization step can be used to halt processing certain actions (like location changed)
 */
export function notifyInitialized() : Action {
    return { type: ActionTypes.INITIALIZED }
}

/**
 * An action that asynchronously begins loading the blog list,
 * and once complete dispatches the load results.
 */
export function fetchBlogBriefs() : AsyncAction {
    return async (dispatch) => {
        try {
            let articles = await api.getBlogBriefs();
            dispatch({
                type: ActionTypes.ARTICLE_LIST_LOADED,
                data: articles
            });
        } catch (err) {
            dispatch(error(err));
        }
    }
}

/**
 * An action that asynchronously begins loading a blog post,
 * and once complete dispatches the result.
 */
export function fetchBlogArticle(id: string) : AsyncAction {
    return async (dispatch) => {
        try {
            let article = await api.getBlogArticle(id);
            dispatch({
                type: ActionTypes.ARTICLE_LOADED,
                data: article
            });
        } catch (err) {
            dispatch(error(err));
        }
    }
}