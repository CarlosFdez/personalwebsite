import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { promisify } from 'util';

import * as React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { createStore } from '../assets/src/store'
import { PortfolioSite } from '../assets/src/components'
import { loadPortfolio } from './portfolio';



// simple configuration data
const assets_location = path.join(__dirname, '../assets/build');
const portfolio_location = path.join(__dirname, '../portfolio_data/', 'test/');

const app = express();
const renderPage = promisify(app.render);
const portfolio = loadPortfolio(portfolio_location);

app.use('/assets', express.static(assets_location));

app.use(function (err, req, res, next) {
    // todo: if err.statusCode is 403 or something else, do that instead
    console.error(err.stack);
    res.status(500).send('Something broke!')
});


// Use nunjucks as our server-side render engine
// We don't use it for very much, React does most of the work
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

// api fallthrough. Show 404
app.get('/api/*', (req, res : express.Response) => {
    res.sendStatus(404);
})

/**
 * Performs a server side rendering on the base page
 * @param req 
 * @param res 
 * @param props - Data that gets sent to the static context
 * @param state - 
 */
function renderBase(req : express.Request, res : express.Response) {
    var ctx = {};
    let initialState = { isServerRendered: true };

    const html = renderToString(
        <StaticRouter location={req.url} context={ctx}>
            <PortfolioSite/>
        </StaticRouter>);
        
    let status = 200
    const data = { renderedHtml: html, initialState: initialState };
    res.status(status).render('base.html', data);
}

app.use((req, res) => {
    renderBase(req, res);
});

// matches slug strings. 25-I-dont-care will match 25 as the id
//app.get('/blog/:article_id(\\d+)(-[-0-9A-Za-z]+)?', async (req, res) => {
//    let id = req.params.article_id;
//    let item = portfolio['blog'].getItem(id);
//    res.render('article.html', item);
//});

// If not handled by any middleware, its a 404
/*app.use(function(req, res) {
    res.send(404, 'Page not found');
});*/

async function start(port : number) {
    await portfolio.loadAll();
    app.listen(port, () => {
        console.log(`Portfolio running on port ${port}`);
    });
}

start(5000);