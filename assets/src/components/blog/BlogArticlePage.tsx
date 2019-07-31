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

/**
 * Type used to encapsulate an analyzeHtmlHeaders result
 */
type HeaderMeta = {
    priority: Number,
    title: String
}

/**
 * Function used to scan an article for h1, h2, and h3 tags, and return
 * @param ref 
 */
function analyzeHtmlHeaders(ref: HTMLElement): HeaderMeta[] {
    let results = [];
    for (let i = 0; i < ref.children.length; i++) {
        let child = ref.children.item(i);
        
        let supportedTags = ["h1", "h2", "h3"];
        let tagName = child.tagName.toLowerCase();
        if (supportedTags.indexOf(tagName) != -1) {
            results.push({
                priority: supportedTags.indexOf(tagName),
                title: child.textContent
            })
        } else if (child instanceof HTMLElement) {
            results.push(...analyzeHtmlHeaders(child))
        }
    }
    return results;
}

interface BlogArticlePageProps extends RouteComponentProps<any> {
    article: Loadable<BlogEntryFull>,
    dispatch: Dispatch<any>
}

type BlogArticlePageState = {
    headers: HeaderMeta[],
    scrolling: Boolean,
    headerSize: Number
}

/**
 * Component class for the blog page used to load and display an article
 */
export const BlogArticlePage = connect(
    (state : AppState) => ({ article: state.portfolio.article })
) (
    class BlogArticlePage extends React.Component<BlogArticlePageProps, BlogArticlePageState> {
        constructor(props) {
            super(props);
            this.state = { headers: [], scrolling: false, headerSize: 0 }
        }

        componentDidMount() {
            this.tryLoadArticle();

            // register scroll observer
            window.addEventListener('scroll', this.checkIsScrolling.bind(this));
        }
    
        componentWillUnmount() {
            window.removeEventListener('scroll', this.checkIsScrolling);
        }

        checkIsScrolling() {
            let headerSize = document.getElementsByClassName("main-header")[0].scrollHeight;

            // Get the viewport position of the header. Adjust for header size
            let articleHeader = document.querySelector(".article header");
            let articlePosition = articleHeader.getBoundingClientRect().top - headerSize

            let isScrolling = articlePosition < 0
            this.setState({ headerSize: headerSize, scrolling: isScrolling });
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

            let data = this.props.article.data
            
            let scrollingClass = this.state.scrolling ? 'scrolling' : '';
            let headers = (this.state.headers || []).map((header, index) =>
                <li key={index}>{header.title}</li>
            )

            return (
                <DocumentTitle title={ this.props.article.data.title }>
                    <section>
                        <div className="article">    
                            <div className="article-sidebar">
                                <ul className={`sidebar-contents ${scrollingClass}`}>
                                    { headers }
                                </ul>
                            </div>
                            
                            <header>
                                <h1 className="title">{ data.title }</h1>
                                <DateLine date={ data.published }/>
                            </header>
                            <div 
                                id="article-content"
                                dangerouslySetInnerHTML={{__html: data.content}}
                                ref={ (ref) => { this.analyzeBlogContent(ref) } }/>
                        </div>
                    </section>
                </DocumentTitle>
            )
        }

        /**
         * Analyzes blog content to populate the sidebar.
         * @param ref 
         */
        analyzeBlogContent(ref: HTMLDivElement) {
            if (ref == null || this.state.headers.length > 0) {
                return
            }

            let headers = analyzeHtmlHeaders(ref);
            this.setState({ headers: headers })
        }
    }
)