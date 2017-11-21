import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

import { Portfolio } from './portfolio';
import routes from './routes';
import * as apiroutes from './apiroutes';

import { ApiClient } from '../lib/apiclient';

import * as render from './render'

import * as env from './environment'
import { createAssetRouter } from './portfolio/assetrouter';

// shim to allow async iterators to work on the server
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");


console.log(`Running in ${(env.settings.mode)} mode`);

const app = express();

// initialize basic routing. Route these with njinx instead for better performance
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

// initialize portfolio system now before we get to anything else
const portfolioEnv = env.settings.mode;
const portfolioLocation = path.join(__dirname, '../portfolio_data/', portfolioEnv);
let portfolio = new Portfolio(portfolioLocation);

// register the routes listed in the routes file
app.use(apiroutes.createRoutes(portfolio));
app.use(createAssetRouter(portfolio));
app.use(routes);

async function startServer(port : number) {
    console.log('Remember to rebuild the portfolio after every portfolio change');

    app.listen(port, () => {
        console.log(`Portfolio running on port ${port}\n`);
    });
}

startServer(env.settings.port);