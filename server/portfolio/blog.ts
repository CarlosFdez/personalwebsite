import * as path from 'path';
import * as fs from 'fs-extra';
import { promisify } from 'util';
import { PortfolioItemEngine } from './core';

function getIdFromSlug(slug : string) : string {
    let [idStr, ..._] = slug.split('-', 1);
    idStr = idStr.replace(/^0+/, '');
    return idStr;
}

interface BlogItem {
    // path on disk
    path: string;
    entry: BlogEntry;
}

// data that can be shown to a 
interface BlogEntry {
    id : string;
    metadata: object;
}

export class BlogEngine implements PortfolioItemEngine {
    itemMap : { [id: string] : BlogItem };
    rootDir : string;

    getItem(itemId : string) {
        return this.itemMap[itemId].entry;
    }

    getAsset(itemId : string, relativeUrl : string) {
        let item = this.itemMap[itemId];
        if (!item) {
            return null;
        }

        let basePath = path.join(item.path, 'assets/');
        
        return { 
            itemRoot : path.resolve(basePath),
            relativePath : relativeUrl
        };
    }

    async load(rootDir : string) {
        this.rootDir = rootDir;
        this.itemMap = {};

        let folders = await fs.readdir(this.rootDir);
        for (let name of folders) {
            let itemPath = path.join(this.rootDir, name);
            let metaPath = path.join(itemPath, "meta.json");
            if (!(await fs.pathExists(metaPath)))
                continue;

            let data = await fs.readJson(metaPath);

            let id = getIdFromSlug(name);
            this.itemMap[id] = {
                path: itemPath,
                entry: {
                    id: id.toString(),
                    metadata: data
                }
            };
            console.log(`Imported blog entry ${id} ${name}`);
        }
    }
}