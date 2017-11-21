import { Portfolio } from "./index";
import { AsyncRouter } from "../lib/asyncrouter/index";
import { slugRouteRule } from "../lib/index";

/**
 * Creates express routes to server portfolio assets
 * TODO: Maybe the build process should set up symlinks so that this works naturally?
 */
export function createAssetRouter(portfolio : Portfolio) {
    let router = AsyncRouter();

    router.getAsync(`/blog/${slugRouteRule('id')}/assets/:path(*)`, async (req, res) => {
        let asset = await portfolio.blog.getAsset(req.params.id, req.params.path);
        if (asset) {
            res.sendFile(asset.relativePath, { root: asset.itemRoot });
        } else {
            res.sendStatus(404);
        }
    })

    return router;
}