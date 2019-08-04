import * as React from "react";
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import { DateLine } from '../common'

import { BlogEntry } from '../../../../apiclient'
import { AppState, Loadable } from '../../store';
import { fetchBlogBriefs } from '../../store/actions'

import { createSlug } from '../../../../shared/slug'

const BlogBrief = (props : BlogEntry) => (
    <Link className="article-brief" to={"/blog/"+createSlug(props._id, props.title)}>
        <h2 className="title">{props.title}</h2>
        
        <DateLine date={ new Date(props.published) }/>
        <div className="brief">
            { props.brief }
        </div>
    </Link>
)

interface BlogPageProps {
    articles: Loadable<BlogEntry[]>
    dispatch: Dispatch<any>
}

/**
 * Component class for a list of blog articles
 */
export const BlogPage = connect(
    (state : AppState) => ({ articles: state.portfolio.articleList }),
) (
    class BlogPage extends React.Component<BlogPageProps> {
        constructor(props) {
            super(props);
            console.log(props);
        }
    
        componentDidMount() {
            this.tryLoadArticles();
        }
    
        tryLoadArticles() {
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
                <BlogBrief key={item._id} {...item}/>
            ));
            return (
                <div className="article-list">
                    { briefs }
                </div>
            )
        }
    }
)
