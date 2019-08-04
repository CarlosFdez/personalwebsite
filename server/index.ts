/**
 * The main entry point for the server. 
 * Executing this file will start up the web server, serving
 * asset files, rendered pages, and portfolio assets.
 * 
 * It is recommended to use njinx to server /assets/build and /assets/static.
 * Doing so will have the user bypass express for loading the asset files.
 * 
 * PORT and NODE_ENV are configurable. The port can be supplied by using
 * yarn run start PORT_NUMBER.
 */

import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import * as webpack from 'webpack';

import * as env from './environment';

import { Portfolio } from './portfolio';

import routes from './routes';
import * as apiroutes from './apiroutes';
import { createAssetRouter } from './portfolio/assetrouter';

const isProduction = env.settings.mode == env.Mode.Production
console.log(`Running in ${(env.settings.mode)} mode`);

const app = express();

// In development mode, run and build webpack, and enable HMR (hot reloading)
if (!isProduction) {
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    var webpackConfig = require('../webpack.config')({ mode: env.settings.mode });
    var compiler = webpack(webpackConfig);
    console.log("Loaded webpack config");
    
    // Enable hot module reloading (HMR)
    app.use(devMiddleware(compiler, {
        noInfo: true, 
        publicPath: webpackConfig.output.publicPath
    }))
    app.use(hotMiddleware(compiler));
    console.log("Enabled hot module reloading");
}

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


// Run server
let port = env.settings.port;
let server = app.listen(port, () => {
    console.log(`Portfolio website running on port ${port}`);
    console.log('Remember to rebuild the portfolio after every portfolio change');
    console.log();
});


// shut down server on a SIGTERM (normal kill command)
// or SIGINT (forced kill command)
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
