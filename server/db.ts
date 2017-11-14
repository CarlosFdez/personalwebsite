// mongo standard requires a global database object

import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017/personalwebsite';

// each subscription to the same promise creates a new connection (Db object)
let connectionPool : Promise<void | Db> = MongoClient.connect(url).catch(err => console.error(err));

/**
 * Asynchronously connects to a mongo db instance located at
 * mongodb://localhost:27017/personalwebsite.
 */
export async function connect() : Promise<Db> {
    let connection: void | Db = await connectionPool;
    if (!connection) {
        // todo: research is this the reason why void is a valid result?
        throw new Error("connection closed");
    }
    return connection;
}

// internally used to close all connections when the program quits
function close() {
    connect().then(async (db) => {
        db.close();
    });
}

// idea came from https://github.com/alaingalvan/alain.xyz/blob/53a29be04ffa66d0be4513cc9f6a427d4f769910/packages/backend/src/db.ts
process
    .on('SIGTERM', close)
    .on('SIGINT', close);
