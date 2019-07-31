import * as React from "react";
import { withRouter, NavLink, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import * as DocumentTitle from 'react-document-title';
import { hot } from 'react-hot-loader'

import { AppState } from '../store';
import { AppRouter } from './routes'

import { HttpError } from '../../../apiclient';

type PortfolioSiteProps = RouteComponentProps<{}> & {
    error?: any
}

interface PortfolioSiteState {
    scrolling : boolean

    /**
     * True if the portfolio hasn't finished loading its initial state.
     * Most animations are suppressed while loading
     */
    loading: boolean
}

/** 
 * The main component of the site. 
 * This component displays navigations and the subcomponents that define pages.
 * Wrap this component in a router so that routing can function.
 */
export const PortfolioSite = hot(module)(withRouter(connect((state : AppState) => ({ error: state.portfolio.error })) (
    class PortfolioSite extends React.Component<PortfolioSiteProps, PortfolioSiteState> {
        header: HTMLDivElement;
    
        constructor(props) { 
            super(props);
            this.state = {  scrolling: false, loading: true };
        }
    
        componentDidMount() {
            this.checkIsScrolling();
            window.addEventListener('scroll', this.checkIsScrolling.bind(this));
    
            // once we're done remove "loading" at the very end of everything.
            window.setTimeout(() => {
                this.setState({ ...this.state, loading: false });
            }, 0);
        }
    
        componentWillUnmount() {
            window.removeEventListener('scroll', this.checkIsScrolling);
        }
        
        /**
         * Function that checks if we are scrolling, 
         * updating the state to reflect it.
         */
        checkIsScrolling() {
            let scrolling = window.scrollY > 0;
            this.setState({ ...this.state, scrolling: scrolling });
        }
        
        render() {
            let error = this.props.error;
            let loadingClass = (this.state.loading) ? 'loading' : '';
            let scrollingClass = (this.state.scrolling) ? 'scrolling' : '';
    
            return (
                <div className={"website-layout " + loadingClass}>
                    <header className={"main-header " + scrollingClass}>
                        <div className="header-body">
                            <div className="content">
                                <NavLink exact to="/" className="title">Carlos Fernandez</NavLink>  
                                <nav>
                                    <NavLink exact to="/" activeClassName="selected">Home</NavLink>
                                    <NavLink to="/blog" activeClassName="selected">Blog</NavLink>
                                </nav>
                            </div>
                        </div>
                        <div className="header-gap"></div>
                    </header>
                    <main>
                        <DocumentTitle title="Carlos Fernandez">
                            <AppRouter error={error}/>
                        </DocumentTitle>
                    </main>
                    <footer className="main-footer">
                        <div className="content">
                            &copy; 2017 Carlos Fernandez
    
                            <aside>
                                <a rel="alternate" type="application/rss+xml" href="/rss.xml"><i className="fa fa-rss" aria-hidden="true"/></a>
                                <a href="https://github.com/CarlosFdez"><i className="fa fa-github" aria-hidden="true"/></a>
                                <a href="https://twitter.com/MeSoSupe"><i className="fa fa-twitter" aria-hidden="true"/></a>
                                <a href="https://www.youtube.com/channel/UCNxCpInDAfcdp-PHZO4PtOA"><i className="fa fa-youtube-play" aria-hidden="true"/></a>
                            </aside>
                        </div>
                    </footer>
                </div>
            );
        }
    }
)));
