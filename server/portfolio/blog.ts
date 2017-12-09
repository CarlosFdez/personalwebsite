import * as path from 'path';
import * as fs from 'fs-extra';
import markademic from 'markademic';
import { promisify } from 'util';
import { PortfolioItemEngine, PortfolioAsset } from './types';

import { BlogEntry, BlogEntryFull } from '../../apiclient';
import { getIntIdFromSlug } from '../../shared/slug'
import { connect } from '../lib/db'
import * as env from '../environment';

/** 
 * Represents a class that loads the blog portion of the portfolio
 */
export class BlogEngine implements PortfolioItemEngine<BlogEntry, BlogEntryFull> {

    constructor(public rootDir: string) {}

    loadItems() {
        return this.loadItemsBase({_id: 1});
    }

    loadItemsReverse() {
        return this.loadItemsBase({_id: -1});
    }

    async loadItem(itemId : string) : Promise<BlogEntryFull> {
        let item = await this.loadRawItem(itemId);
        if (!item) {
            return null;
        }

        let result =  { ...item, content: '' }

        try {
            // todo: make a better more generalized way of getting this...
            let itemUrl = `/blog/${item._id}`;

            let contentPath = path.join(this.rootDir, item.localId, "content.md");
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
        let item = await this.loadRawItem(itemId);
        
        if (!item) {
            return null;
        }

        let basePath = path.join(this.rootDir, item.localId, 'assets/');
        
        return { 
            itemRoot : path.resolve(basePath),
            relativePath : relativeUrl
        };
    }

    async build() {
        let connection = await connect();
        try {
            await connection.dropCollection('blog');
        } catch (err) {
            // most likely ns not found. Continue anyways
            // note: production does not have error codes fsr
        }

        let collection = await connection.createCollection<BlogEntry>('blog');

        let reader = this.readFolders();
        let promises : Promise<any>[] = [];
        for await (let entry of reader) {
            promises.push(collection.insertOne(entry));
        }
        await promises;
    }

    // todo: private methods are tied to the persistance and are candidates for separation

    private async* loadItemsBase(sortingDict) {
        let connection = await connect();
        let collection = connection.collection('blog');

        let cursor = collection.find({}).sort(sortingDict);
        while (await cursor.hasNext()) {
            yield (await cursor.next()) as BlogEntry;
        }
    }

    private async loadRawItem(itemId : string) : Promise<BlogEntry> {
        let connection = await connect();
        let collection = connection.collection('blog');
        return await collection.findOne({ _id: parseInt(itemId) });
    }

    /**
     * Inner function to read blog folders asynchronously
     */
    private async *readFolders() : AsyncIterableIterator<BlogEntry> {
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
                _id: getIntIdFromSlug(name),
                localId: name,
                title: meta.title,
                published: new Date(meta.published),
                keywords: meta.keywords,
                brief: brief
            };
            console.log(`Imported blog entry ${id} ${name}`);
        }
    }
}
