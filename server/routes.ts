import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs-extra';

import { ApiClient, HttpError } from '../lib/apiclient';
import { loaded } from '../assets/src/store';

import { serverRender, clientRender } from './render'

import { AsyncRouter } from './lib/asyncrouter'
import { slugRouteRule } from './lib/index'

import * as env from './environment';

let router = AsyncRouter();

const api = new ApiClient(`http://127.0.0.1:${env.settings.port}`);

router.get("/", (req, res) => {
    serverRender(req, res);
})

router.getAsync("/rss.xml", async (req, res) => {
    let rssPath = path.join(__dirname, '../assets/rss.xml');
    let data = await fs.readFile(rssPath, 'utf8');
    res.set('Content-Type', 'text/xml');
    res.send(data);
});

router.getAsync("/blog", async (req, res) => {
    var items = await api.getBlogBriefs();
    serverRender(req, res, { articleList: loaded(items) });
});

// matches slug strings. 25-I-dont-care will match 25 as the id
router.getAsync(`/blog/${slugRouteRule('article_id')}`, async (req, res) => {
    let id = req.params.article_id;
    var data = await api.getBlogArticle(id);
    serverRender(req, res, { article: loaded(data) });
});

// fallback global rendering.
// This is most likely a 404, so we still use server side rendering
router.use((req, res) => {
    // todo: this is triggering on lookups for favicon.png
    // rethink this? 
    serverRender(req, res);
});

// Register the global error handler at the end after all the routes
router.use((err, req, res, next) => {
    // todo: if err.statusCode is 403 or something else, do that instead
    console.error(err.stack);
    res.status(500);

    let error = new HttpError("Something broke", 500);
    serverRender(req, res, { error: error});
});


export default router;