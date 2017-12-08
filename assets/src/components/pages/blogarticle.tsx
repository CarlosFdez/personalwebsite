import * as React from "react";
import { connect, Dispatch } from 'react-redux';
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

@connect(
    (state : AppState) => ({ article: state.article })
)
export class BlogArticlePage extends React.Component<BlogArticlePageProps> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.tryLoadArticle();
    }

    componentDidUpdate() {
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