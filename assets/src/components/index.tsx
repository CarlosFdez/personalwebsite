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
    if (error instanceof HttpError && error.statusCode == 404) {
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

// without withRouter, connect prevents react-router from working...
@withRouter
@connect((state : AppState) => ({ error: state.error }))
export class PortfolioSite extends React.Component<PortfolioSiteProps> {
    render() {
        let error = this.props.error;

        return [
            <div className="website-layout">
                <header className="main-header">
                    <div className="content">
                        <a href="#" className="performScroll">Carlos Fernandez</a>  
                        <nav>
                            <NavLink exact to="/" activeClassName="selected">Home</NavLink>
                            <NavLink to="/blog" activeClassName="selected">Blog</NavLink>
                        </nav>
                    </div>
                </header>
                <div className="header-gap"></div>
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
        ];
    }
}

