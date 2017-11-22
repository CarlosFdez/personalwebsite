import * as path from 'path';
import * as fs from 'fs-extra';
import markademic from 'markademic';
import { promisify } from 'util';
import { PortfolioItemEngine, PortfolioAsset } from './types';

import { BlogEntry, BlogEntryFull } from '../../apiclient';
import { getIntIdFromSlug } from '../../shared/slug'
import { connect } from '../lib/db'
import * as env from '../environment';

export class BlogEngine implements PortfolioItemEngine<BlogEntry, BlogEntryFull> {

    constructor(public rootDir: string) {}

    async* _loadItemsBase(sortingDict) {
        let connection = await connect();
        let collection = connection.collection('blog');

        let cursor = collection.find({}).sort(sortingDict);
        while (await cursor.hasNext()) {
            yield (await cursor.next()) as BlogEntry;
        }
    }

    loadItems() {
        return this._loadItemsBase({id: 1});
    }

    loadItemsReverse() {
        return this._loadItemsBase({id: -1});
    }

    async loadItem(itemId : string) : Promise<BlogEntryFull> {
        let connection = await connect();
        let collection = connection.collection('blog');
        let item = await collection.findOne({ id: itemId });
        
        if (!item) {
            return null;
        }
        
        let brief = item as BlogEntry;
        let result =  { ...brief, content: '' }

        try {
            // todo: make a better more generalized way of getting this...
            let itemUrl = `/blog/${brief.id}`;

            let contentPath = path.join(this.rootDir, brief.localId, "content.md");
            let fileData = await fs.readFile(contentPath, "utf8");
            result.content = markademic({
                input: fileData,
                rerouteLinks: (route) => path.join(itemUrl, route)
            });
        } catch (err) { 
            console.error(err);
            /* do nothing, no content loaded */
        }

        return result;
    }

    /** 
     * Retrieves disk information about a portfolio item, 
     * based on the id and its relative URL
     */
    async getAsset(itemId : string, relativeUrl : string) : Promise<PortfolioAsset> {
        let connection = await connect();
        let collection = connection.collection('blog');
        let item = await collection.findOne({ id: itemId });
        
        if (!item) {
            return null;
        }

        let basePath = path.join(this.rootDir, item.localId, 'assets/');
        
        return { 
            itemRoot : path.resolve(basePath),
            relativePath : relativeUrl
        };
    }

    /**
     * Inner function to read blog folders asynchronously
     */
    async *_readFolders() : AsyncIterableIterator<BlogEntry> {
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

            let id = getIntIdFromSlug(name);
            yield {
                localId: name,
                id: id.toString(),
                title: meta.title,
                published: new Date(meta.published),
                brief: brief
            };
            console.log(`Imported blog entry ${id} ${name}`);
        }
    }

    async build() {
        let connection = await connect();
        try {
            await connection.dropCollection('blog');
        } catch (err) {
            // NamepaceNotFound
            if (err.code != 26) throw err;
        }

        let collection = connection.collection('blog');

        let reader = this._readFolders();
        let promises : Promise<any>[] = [];
        for await (let entry of reader) {
            promises.push(collection.insertOne(entry));
        }
        await promises;
    }
}
