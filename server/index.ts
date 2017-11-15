import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

import { getPortfolio } from './portfolio';
import { registerApiRoutes, registerRoutes } from './routes'

import { ApiClient } from '../lib/apiclient';

import * as render from './render'

// shim to allow async iterators to work on the server
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");


const isProduction = process.env.NODE_ENV == "production";
console.log(`Running in ${(isProduction) ? 'production' : 'development'} mode`);

let port = parseInt(process.env.PORT || process.argv[2]) || 5000;

const portfolioEnv = (isProduction) ? 'prod' : 'dev'
const portfolioLocation = path.join(__dirname, '../portfolio_data/', portfolioEnv);

const app = express();
const portfolio = getPortfolio(portfolioLocation);
const apiClient = new ApiClient(`http://127.0.0.1:${port}`);

const assetRoot = path.join(__dirname, '../assets/');
const staticLocation = path.join(assetRoot, 'static/');
const assetsLocation = path.join(assetRoot, 'build/');
app.use('/assets/build', express.static(assetsLocation));
app.use('/assets/static', express.static(staticLocation));

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
    console.log('Remember to rebuild the portfolio after every portfolio change');

    app.listen(port, () => {
        console.log(`Portfolio running on port ${port}\n`);
    });
}

startServer(port);