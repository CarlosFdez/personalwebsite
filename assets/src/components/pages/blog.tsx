import * as React from "react";
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom';

import { BlogEntry } from '../../../../lib/apiclient'
import { AppState, Loadable } from '../../store';
import { fetchBlogBriefs } from '../../store/actions'

import { createSlug } from '../../../../lib/slug'

const BlogBrief = (props : BlogEntry) => (
    <Link className="article-brief" to={"/blog/"+createSlug(props.id, props.title)}>
        <h2 className="title">{props.title}</h2>
        <div className="date">
            <i className="fa fa-calendar" aria-hidden="true"></i>
            { new Date(props.published).toDateString() }
        </div>
        <div className="brief">
            { props.brief }
        </div>
    </Link>
)

interface BlogPageProps {
    articles: Loadable<BlogEntry[]>
    dispatch: Dispatch<any>
}

@connect(
    (state : AppState) => ({ articles: state.articleList }),
)
export class BlogPage extends React.Component<BlogPageProps> {
    constructor(props) {
        super(props);
        console.log(props);
    }

    async componentDidMount() {
        if (!this.props.articles.loaded) {
            this.props.dispatch(fetchBlogBriefs());
        }
    }

    render() {
        if (!this.props.articles.loaded) {
            return null;
        }

        let data = this.props.articles.data
        let briefs = (data || []).map((item) => (
            <BlogBrief key={item.id} {...item}/>
        ));
        return (
            <div className="article-list">
                { briefs }
            </div>
        )
    }
}