import * as React from "react";
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps} from 'react-router';
import * as DocumentTitle from 'react-document-title';

import { DateLine } from '../common';

import { BlogEntryFull } from '../../../../apiclient';
import { getIdFromSlug } from '../../../../shared/slug';
import { AppState, Loadable } from '../../store';

import { fetchBlogArticle } from '../../store/actions';

const BlogArticle = (props : BlogEntryFull) => (
    <section>
        <div className="article">
            <header>
                <h1 className="title">{ props.title }</h1>
                <DateLine date={ props.published }/>
            </header>
            <div dangerouslySetInnerHTML={{__html: props.content}}/>
        </div>
    </section>
)

interface BlogArticlePageProps extends RouteComponentProps<any> {
    article: Loadable<BlogEntryFull>,
    dispatch: Dispatch<any>
}

/**
 * Component class for the blog page used to load and display an article
 */
export const BlogArticlePage = connect(
    (state : AppState) => ({ article: state.article })
) (
    class BlogArticlePage extends React.Component<BlogArticlePageProps> {
        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.tryLoadArticle();
        }

        tryLoadArticle() {
            if (!this.props.article.loaded) {
                let id = this.props.match.params['id'];
                this.props.dispatch(fetchBlogArticle(id));
            }
        }

        render() {
            if (!this.props.article.loaded) {
                return null;
            }

            return (
                <DocumentTitle title={ this.props.article.data.title }>
                    <BlogArticle {...this.props.article.data}/>
                </DocumentTitle>
            )
        }
    }
)