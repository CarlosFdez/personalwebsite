import { ApiClient } from '../../../apiclient'
var api = new ApiClient('/');

export function error(err) {
    console.error(err);
    return {
        type: 'ERROR',
        data: err
    }
}

export function fetchBlogBriefs() {
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

export function fetchBlogArticle(id: string) {
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