import * as React from "react";
import { HomePage } from './home';
import { BlogPage, BlogArticlePage } from './blog';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';

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
        <p>Officially we call this a 404 error...</p>
    </section>
)

/**
 * Defines the routing that the website uses.
 * Must be used in a component marked by "withRouter".
 * This component does not include the <Router>. You'll have to wrap it with one.
 */
export function AppRouter(props) {
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
        </Switch>
    );
}
