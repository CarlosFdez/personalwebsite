import * as React from "react";
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps} from 'react-router';

import { DateLine } from '../common';

import { BlogEntryFull } from '../../../../apiclient'
import { getIdFromSlug } from '../../../../shared/slug'
import { AppState, Loadable } from '../../store';

import { fetchBlogArticle } from '../../store/actions'

const BlogArticle = (props) => (
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
    async componentDidMount() {
        if (!this.props.article.loaded) {
            let id = this.props.match.params['id'];
            this.props.dispatch(fetchBlogArticle(id));
        }
    }

    render() {
        return (
            <BlogArticle {...this.props.article.data}/>
        )
    }
}