import { ApiClient } from '../../../apiclient'
import { ThunkAction } from 'redux-thunk';
import { AppState } from './state';
var api = new ApiClient('/');

export function error(err) {
    console.error(err);
    return {
        type: 'ERROR',
        data: err
    }
}

type AsyncAction = ThunkAction<Promise<void>, AppState, any>;

export function fetchBlogBriefs() : AsyncAction {
    return async (dispatch) => {
        try {
            let articles = await api.getBlogBriefs();
            dispatch({
                type: 'ARTICLE_LIST_LOADED',
                data: articles
            });
        } catch (err) {
            dispatch(error(err));
        }
    }
}

export function fetchBlogArticle(id: string) : AsyncAction {
    return async (dispatch) => {
        try {
            let article = await api.getBlogArticle(id);
            dispatch({
                type: 'ARTICLE_LOADED',
                data: article
            });
        } catch (err) {
            dispatch(error(err));
        }
    }
}