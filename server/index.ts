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
const static_location = path.join(__dirname, '../assets/static');
const assets_location = path.join(__dirname, '../assets/build');
const portfolio_location = path.join(__dirname, '../portfolio_data/', 'test/');
const apiRoot = `http://127.0.0.1:${port}`;

const app = express();
const portfolio = getPortfolio(portfolio_location);
const apiClient = new ApiClient(apiRoot);

app.use('/assets/static', express.static(static_location));
app.use('/assets', express.static(assets_location));

// Use nunjucks as our server-side render engine
// We don't use it for very much, React does most of the work
nunjucks.configure(path.join(__dirname, 'templates'), {
    autoescape: true,
    express: app
});


// register the routes listed in the routes file
registerApiRoutes(app, portfolio);
registerRoutes(app, portfolio, apiClient);

async function startServer(port : number) {
    await portfolio.loadAll();
    app.listen(port, () => {
        console.log(`Portfolio running on port ${port}`);
    });
}

startServer(port);