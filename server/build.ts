// builds the portfolio

import * as fs from 'fs-extra';
import * as path from 'path';

import { Portfolio } from './portfolio';

// shim to allow async iterators to work on the server
(<any>Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");


// All the test methods are deprecated, so we make one here
// Try catching a lot of code for one little thing is tedious
async function directoryExists(pathTest : string) {
    try {
        const folderData = await fs.stat(pathTest);
        return folderData.isDirectory();
    } catch (err) {
        if (err.code == "ENOENT")
            return false;
        
        console.error(err);
        return false;
    }
}

let builder = (async function() {
    let directory = process.argv[2];
    if (!directory) {
        console.error("Error: Portfolio environment required");
        process.exit(0);
    }
    if (!directory.match(/[a-zA-Z0-9]+/)) {
        console.error("Error: Invalid format for directory");
        process.exit(0);
    }

    let rootPath = path.join(__dirname, '../portfolio_data/', directory);
    let exists = await directoryExists(rootPath);
    if (!exists) {
        console.error(`Error: Portfolio directory ${directory} doesn't exist in portfolio_data`);
        process.exit(0);
    }
    
    const portfolio = new Portfolio(rootPath);
    await portfolio.build();
});

builder()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1)
    });
