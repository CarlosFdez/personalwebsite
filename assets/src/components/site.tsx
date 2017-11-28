import * as React from "react";
import { withRouter, Route, NavLink, Switch } from 'react-router-dom';
import { connect, Dispatch } from 'react-redux'
import { AppState } from '../store';

import { NotFound, ApplicationError } from './pages/errors';
import { HomePage } from './pages/home';
import { BlogPage } from './pages/blog';
import { BlogArticlePage } from './pages/blogarticle';

import { HttpError } from '../../../apiclient'

const PortfolioMain = (props) => {
    let error = props.error;
    if (error && error['statusCode'] == 404) {
        return <NotFound/>;
    } else if (error) {
        return <ApplicationError/>;
    }

    return (
        <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/blog" component={BlogPage}/>
            <Route path="/blog/:id" component={BlogArticlePage}/>
            <Route component={NotFound}/>
        </Switch>);
}

interface PortfolioSiteProps {
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

// without withRouter, connect prevents react-router from working...
@withRouter
@connect((state : AppState) => ({ error: state.error }))
export class PortfolioSite extends React.Component<PortfolioSiteProps, PortfolioSiteState> {
    header: HTMLDivElement;

    constructor(props) { 
        super(props);
        this.state = {  scrolling: false, loading: true };
    }

    componentDidMount() {
        this.testScrolling();
        window.addEventListener('scroll', this.testScrolling.bind(this));

        // once we're done remove "loading" at the very end of everything.
        window.setTimeout(() => {
            this.setState({ ...this.state, loading: false });
        }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.testScrolling);
    }

    testScrolling() {
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
                            <a href="#" className="title performScroll">Carlos Fernandez</a>  
                            <nav>
                                <NavLink exact to="/" activeClassName="selected">Home</NavLink>
                                <NavLink to="/blog" activeClassName="selected">Blog</NavLink>
                            </nav>
                        </div>
                    </div>
                    <div className="header-gap"></div>
                </header>
                <main>
                    <PortfolioMain error={error}/>
                </main>
                <footer className="main-footer">
                    <div className="content">
                        &copy; 2017 Carlos Fernandez

                        <aside>
                            <a href="/rss.xml"><i className="fa fa-rss" aria-hidden="true"/></a>
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

