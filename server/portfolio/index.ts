import * as path from 'path';
import { PortfolioItemEngine, PortfolioAsset } from './core';
import { BlogEngine } from './blog';

/**
 * Loads an initializes the portfolio system. 
 * The portfolio system reads data from the given directory and makes it available
 * to the rest of the application.
 * 
 * TODO: Currently it initializes on application start. 
 * Instead it should be able to update the directory without having to restart node.
 */
export function loadPortfolio(dataDirectory : string) {
    let portfolio = new Portfolio(dataDirectory);
    portfolio.addEngine("blog", new BlogEngine());

    return portfolio;
}


class Portfolio {
    engines : { [name:string] : PortfolioItemEngine } = {};

    constructor(public rootDirectory : string) {}

    addEngine(name : string, engine : PortfolioItemEngine) {
        this[name] = engine;
        this.engines[name] = engine;
    }

    async loadAll() {
        for (let name in this.engines) {
            let engineRoot = path.join(this.rootDirectory, name);
            let engine = this.engines[name];
            await engine.load(engineRoot);
        }
    }

    getAsset(assetPath : string) : PortfolioAsset {
        if (!assetPath || assetPath == '/') {
            return null;
        }
        if (assetPath[0] == '/')
            assetPath = assetPath.substr(1);

        let [engineName, itemId, ...remainder] = assetPath.split('/');
        let engine = this.engines[engineName];
        if (!engine) {
            return null;
        }

        let remainderPath = remainder.join('/');
        return engine.getAsset(itemId, remainderPath);
    }

    assetRouter = (req, res, next) => {
        let asset = this.getAsset(req.path);
        if (asset == null) {
            next();
            return;
        }
        
        // this has error forbidden if somone neer-do-well tries some garbage
        let itemPath = asset.relativePath;
        let rootDir = asset.itemRoot;
        res.sendFile(itemPath, { root: rootDir }, (err) => {
            if (err && err.status == 404) {
                next(); // let it propagate, its a success or 404
            } else if (err) {
                next(err);
            } else {
                // file sent successfully, we're done
            }
        });
    }
}