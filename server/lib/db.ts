// mongo standard requires a global database object

import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const dbName = 'personalwebsite'
const url = `mongodb://localhost:27017/`;

// Store the single existing mongo client. From the client we get new connections
let client : MongoClient;

let options : Partial<MongoClientOptions> = {
    connectTimeoutMS: 5000,
    reconnectTries: 4,
    useNewUrlParser: true
};

/**
 * Asynchronously connects to a mongo db instance located at
 * mongodb://localhost:27017/personalwebsite.
 * @param retries Number of times to retry. Negative avoids reconstructing the connection pool.
 */
export async function connect(retries=0) : Promise<Db> {
    if (!client || !client.isConnected()) {
        client = null;
        
        if (retries < 0) {
            // If we get here, its a failed result.
            throw new Error("connection closed");
        }

        // attempt connecting
        let result = await MongoClient.connect(url, options).catch(err => console.error(err));
        if (result) {
            client = result;
        } else {
            return await connect(retries-1);
        }
    }
    
    return client.db(dbName);
}

// internally used to close all connections when the program quits
function close() {
    if (client) {
        client.close();
    }
}

// idea came from https://github.com/alaingalvan/alain.xyz/blob/53a29be04ffa66d0be4513cc9f6a427d4f769910/packages/backend/src/db.ts
// close the connection automatically when the server closes
process.on('SIGTERM', close)
process.on('SIGINT', close);
