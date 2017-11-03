// todo: rearrange everything into proper folders
import * as React from "react";
import { 
    Route, Link, Switch, RouteComponentProps
} from 'react-router-dom';

import "isomorphic-fetch";

import { HomePage } from './home';
import { BlogList, BlogArticle } from "./blog";

import { getStore } from "../store";

/**
 * A wrapper over fetch that throws an exception if the response is not ok.
 * @param input 
 * @param init 
 */
async function fetchHandled(input: RequestInfo, init?: RequestInit) {
    let response = await fetch(input, init);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

class BlogPage extends React.Component {
    render() {
        return (
            <b>Hello I am blog page</b>
        )
    }
}

class BlogArticlePage extends React.Component {
    render() {
        return (
            <b>Hello I am blog article page</b>
        )
    }
}

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
                            <Link to="/">Home</Link>
                            <Link to="/blog">Blog</Link>
                        </nav>
                    </div>
                </header>
                <div className="header-gap"></div>
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route path="/blog" component={BlogPage}/>
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