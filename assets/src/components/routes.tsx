import * as React from "react";
import { HomePage } from './pages/home';
import { BlogPage } from './pages/blog';
import { BlogArticlePage } from './pages/blogarticle';

import { NotFound, ApplicationError } from './pages/errors';

import { Route, Switch } from 'react-router-dom';

/**
 * Defines the routing that the website uses.
 * Must be used in a component marked by "withRouter"
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
