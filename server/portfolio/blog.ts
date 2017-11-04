import * as path from 'path';
import * as fs from 'fs-extra';
import * as Remarkable from 'remarkable';
import { promisify } from 'util';
import { PortfolioItemEngine } from './core';

var md = new Remarkable();

// todo: move to a location the client and server can access
function getIdFromSlug(slug : string) : string {
    let [idStr, ..._] = slug.split('-', 1);
    idStr = idStr.replace(/^0+/, '');
    return idStr;
}

interface BlogDiskItem {
    // path on disk
    path: string;
    entry: BlogEntryBrief;
}


interface BlogEntryBase {
    id : string;
    title: string;
    published: Date;
}

/**
 * Represents a blog post summary
 */
interface BlogEntryBrief extends BlogEntryBase {
    content: string;
}

/**
 * Represents a fully loaded blog entry
 */
interface BlogEntry extends BlogEntryBase {
    /**
     * Contains the data for the blog entry 
     */
    content: string;
}


export class BlogEngine implements PortfolioItemEngine {
    itemMap : { [id: string] : BlogDiskItem };
    rootDir : string;

    *loadItems() {
        for (var i in this.itemMap) {
            yield this.itemMap[i].entry;
        }
    }

    async loadItem(itemId : string) : Promise<BlogEntry> {
        let brief = this.itemMap[itemId].entry;
        let content = md.render();
        return { ...brief, content: content };
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
            let metaPath = path.join(itemPath, 'meta.json');
            let briefPath = path.join(itemPath, 'brief.txt');
            if (!(await fs.pathExists(metaPath))) {
                continue;
            }

            let meta = await fs.readJson(metaPath);
            let brief = "No article brief provided";
            try {
                brief = await fs.readFile(briefPath, 'utf8')
            } catch(err) {}

            let id = getIdFromSlug(name);
            this.itemMap[id] = {
                path: itemPath,
                entry: {
                    id: id.toString(),
                    title: meta.title,
                    published: new Date(meta.published),
                    content: brief
                }
            };
            console.log(`Imported blog entry ${id} ${name}`);
        }
    }
}