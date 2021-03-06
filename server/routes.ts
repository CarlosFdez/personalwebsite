/**
 * This file defines the server side routes, which are executed
 * the first time a visitor loads a page. There is where initial data
 * is loaded, and server side rendering begins.
 * 
 * The rest of the routing is deferred to assets/src/components/routes.tsx,
 * which is the client side routing.
 */

import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs-extra';

import { AsyncRouter } from './lib/asyncrouter';
import { slugRouteRule  } from './lib/index';

import { createSlug } from '../shared/slug';
import { ApiClient, HttpError } from '../apiclient';
import { loaded } from '../assets/src/store';

import { MetaData, serverRender, clientRender } from './render';


import * as env from './environment';

// Creates meta data that will then be applied to meta tags on the server render
const createMeta = (path : string, overrides : Partial<MetaData> = {}) => {
    const defaultMeta : MetaData = {
        path: null,
        author: "Carlos Fernandez",
        description: "I'm a software developer living in South Florida. " +
            "I enjoy learning new things, but above all I love making tools and experiences. ",
        keywords: ['programmer'],
        websiteName: "Carlos Fernandez"
    };

    return {...defaultMeta, path, ...overrides};
}

const api = new ApiClient(`http://127.0.0.1:${env.settings.port}`);

let router = AsyncRouter();

router.get("/", (req, res) => {
    serverRender(req, res, createMeta(req.path));
})

router.getAsync("/rss.xml", async (req, res) => {
    let rssPath = path.join(__dirname, '../assets/rss.xml');
    let data = await fs.readFile(rssPath, 'utf8');
    res.set('Content-Type', 'text/xml');
    res.send(data);
});

router.getAsync("/blog", async (req, res) => {
    var items = await api.getBlogBriefs();
    serverRender(req, res, createMeta(req.path), { articleList: loaded(items) });
});

// matches slug strings. 25-I-dont-care will match 25 as the id
router.getAsync(`/blog/${slugRouteRule('article_id')}`, async (req, res) => {
    let id = req.params.article_id;
    var data = await api.getBlogArticle(id);
    let meta = createMeta(`/blog/${createSlug(data._id, data.title)}`, { 
        description: data.brief,
        keywords: data.keywords
    });
    
    serverRender(req, res, meta, { article: loaded(data) });
});

// fallback global rendering.
// This is most likely a 404, so we still use server side rendering
router.use((req, res) => {
    // todo: check what kind of data is being requested?
    serverRender(req, res, createMeta(req.path));
});

// Register the global error handler at the end after all the routes
router.use((err, req, res, next) => {
    // todo: if err.statusCode is 403 or something else, do that instead
    console.error(err.stack);
    res.status(500);

    let error = new HttpError("Something broke", 500);
    serverRender(req, res, createMeta(req.path), { error: error});
});


export default router;