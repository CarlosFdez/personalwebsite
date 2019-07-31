import * as React from "react";

export const NotFound = function(props) {
    // Notify the server that this is a 404
    const { staticContext } = props;
    if (staticContext) {
        staticContext.is404 = true;
    }

    return (
        <section className="content">
            <h1>Page not found</h1>
            <p>
                It seems you may have taken a wrong turn, or were led into a dead end.<br/>
                I suggest <a href="javascript:history.back()">going back the way you came.</a>
            </p>
            <p>Officially we call this a 404 error...</p>
        </section>
    );
}