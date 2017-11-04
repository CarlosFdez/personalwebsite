// todo: rearrange everything into proper folders
import * as React from "react";
import { Route, NavLink, Switch } from 'react-router-dom';

import { HomePage } from './home';
import { BlogPage, BlogArticlePage } from "./blog";

const NotFound = () => (
    <div>
        Page not found (todo: complete this page)
    </div>
)

export class PortfolioSite extends React.Component<object, object> {
    render() {
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
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route exact path="/blog" component={BlogPage}/>
                        <Route path="/blog/:id" component={BlogArticlePage}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
                <footer className="main-footer">
                    <div className="content">
                        &copy; 2017 Carlos Fernandez

                        <aside>
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