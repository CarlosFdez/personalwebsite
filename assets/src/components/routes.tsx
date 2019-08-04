import * as React from "react";
import { HomePage } from './home';
import { BlogPage, BlogArticlePage } from './blog';
import { NotFound } from './NotFound';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';

const ApplicationError = () => (
    <section className="content">
        <h1>Error</h1>
        <p>
            Unfortunately it seems something broke.
        </p>
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
