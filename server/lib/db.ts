// mongo standard requires a global database object

import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const url = 'mongodb://localhost:27017/personalwebsite';

// each subscription to the same promise creates a new connection (Db object)
let connectionPool : Promise<void | Db>;

let options : Partial<MongoClientOptions> = {
    connectTimeoutMS: 5000,
    reconnectTries: 4
}

/** Internal function to create the connection pool */
function createConnectionPool() {
    connectionPool = MongoClient.connect(url, options).catch(err => console.error(err));
}

// initialize the connection pool
createConnectionPool();

/**
 * Asynchronously connects to a mongo db instance located at
 * mongodb://localhost:27017/personalwebsite.
 * @param retries Number of times to retry. Negative avoids reconstructing the connection pool.
 */
export async function connect(retries=0) : Promise<Db> {
    let connection: void | Db = await connectionPool;

    // Note: isConnected() is an internal method, but mongo does not provide
    // us any other way to determine if the connection is healthy 
    // If we don't do this, then mongo will always throw "Topology was destroyed"
    if (!connection || !(connection as any).serverConfig.isConnected()) {
        // Retry a connection
        if (retries >= 0) {
            createConnectionPool();
            return await connect(retries-1);
        }

        // If we get here, its a failed result.
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
