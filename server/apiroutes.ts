import * as path from 'path';

import { AsyncRouter } from './lib/asyncrouter'
import { slugRouteRule } from './lib/index'
import { getPortfolio } from './portfolio';

import * as env from './environment';

const isProduction = env.settings.mode == env.Mode.Production;

let router = AsyncRouter();
const portfolioEnv = (isProduction) ? 'prod' : 'dev'
const portfolioLocation = path.join(__dirname, '../portfolio_data/', portfolioEnv);
const portfolio = getPortfolio(portfolioLocation);

/** 
 * Consumes an async iterator into memory, creating a list.
 */
async function asyncToList<T>(iter : AsyncIterableIterator<T>) : Promise<T[]> {
    let results = [];
    for await (var item of iter) {
        results.push(item);
    }
    return results;
}


router.getAsync('/api/blog/', async (req, res) => {
    var system = portfolio.blog;
    var items = await asyncToList(system.loadItemsReverse());
    
    var data = { items: items };
    res.json(data);
});

router.getAsync(`/api/blog/${slugRouteRule('id')}`, async (req, res) => {
    var system = portfolio.blog;
    var itemData = await system.loadItem(req.params.id);
    if (itemData == null) {
        res.sendStatus(404);
        return;
    }
    
    res.json({ item: itemData });
});

// api fallthrough. Show 404
router.get('/api/*', (req, res) => {
    res.sendStatus(404);
});

// Register the api global error handler at the end after all the routes
router.use("/api/", function (err, req, res, next) {
    // todo: if err.statusCode is 403 or something else, do that instead
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default router;