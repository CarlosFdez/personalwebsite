// todo: rearrange everything into proper folders
import * as React from "react";
import { withRouter, Route, NavLink, Switch } from 'react-router-dom';
import { connect, Dispatch } from 'react-redux'
import { AppState } from '../store';

import { HomePage } from './pages/home';
import { BlogPage } from './pages/blog';
import { BlogArticlePage } from './pages/blogarticle';

import { HttpError } from '../../../lib/apiclient'

const ApplicationError = () => (
    <section className="content">
        <h1>Error</h1>
        <p>
            Unfortunately it seems something broke.
        </p>
    </section>
)

const NotFound = () => (
    <section className="content">
        <h1>Page not found</h1>
        <p>
            It seems you may have taken a wrong turn, or were led into a dead end.<br/>
            I suggest <a href="javascript:history.back()">going back the way you came.</a>
        </p>
        <p>Officially we call this a 404 error</p>
    </section>
)

const PortfolioRoutes = () => (
    <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/blog" component={BlogPage}/>
        <Route path="/blog/:id" component={BlogArticlePage}/>
        <Route component={NotFound}/>
    </Switch>
);

interface PortfolioSiteProps {
    error?: any
}

// without withRouter, connect prevents react-router from working...
@withRouter
@connect((state : AppState) => ({ error: state.error }))
export class PortfolioSite extends React.Component<PortfolioSiteProps> {
    render() {
        let error = this.props.error;

        // We set the mainElement if redux has been sent an error
        var mainElement;
        if (error && error instanceof HttpError) {
            let statusCode = error.statusCode;
            if (statusCode == 404) {
                mainElement = <NotFound/>;
            } else {
                mainElement = <ApplicationError/>;
            }
        } else if (error) {
            mainElement = <ApplicationError/>
        } else {
            // if there is no error at all, use the normal routing
            mainElement = <PortfolioRoutes/>;
        }

        return (
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
                    { mainElement }
                </main>
                <footer className="main-footer">
                    <div className="content">
                        &copy; 2017 Carlos Fernandez

                        <aside>
                            <a href="/rss.xml"><span className="fa fa-rss" aria-hidden="true"/></a>
                            <a href="https://github.com/CarlosFdez"><span className="fa fa-github" aria-hidden="true"></span></a>
                            <a href="https://twitter.com/MeSoSupe"><span className="fa fa-twitter" aria-hidden="true"></span></a>
                            <a href="https://www.youtube.com/channel/UCNxCpInDAfcdp-PHZO4PtOA"><span className="fa fa-youtube-play" aria-hidden="true"></span></a>
                        </aside>
                    </div>
                </footer>
            </div>
        );
    }
}

