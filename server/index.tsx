import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { promisify } from 'util';

import { getPortfolio } from './portfolio';
import { registerApiRoutes, registerRoutes } from './routes'

import { ApiClient } from '../lib/apiclient';


// simple configuration data.
// todo: flesh out. For example, we may want nginx to serve assets in production
const port = 5000;
const assets_location = path.join(__dirname, '../assets/build');
const portfolio_location = path.join(__dirname, '../portfolio_data/', 'test/');
const apiRoot = `http://127.0.0.1:${port}`;

const app = express();
const portfolio = getPortfolio(portfolio_location);
const apiClient = new ApiClient(apiRoot);

// Use nunjucks as our server-side render engine
// We don't use it for very much, React does most of the work
nunjucks.configure(path.join(__dirname, 'templates'), {
    autoescape: true,
    express: app
});

app.use('/assets', express.static(assets_location));

// register the routes listed in the routes file
registerApiRoutes(app, portfolio);
registerRoutes(app, portfolio, apiClient);

// Register the global error handler at the end after all the routes
app.use(function (err, req, res, next) {
    // todo: if err.statusCode is 403 or something else, do that instead
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

async function startServer(port : number) {
    await portfolio.loadAll();
    app.listen(port, () => {
        console.log(`Portfolio running on port ${port}`);
    });
}

startServer(port);