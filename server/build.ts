// builds the portfolio

import * as fs from 'fs-extra';
import * as path from 'path';

import { Portfolio } from './portfolio';

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
    let dataRoot = path.join(__dirname, '../portfolio_data/');
    if (!(await directoryExists(dataRoot))) {
        console.error("ERROR: Missing portfolio_data/ folder");
        process.exit(0);
    }

    // valid environments are the folders inside of the data root
    let validEnvironments = (await fs.readdir(dataRoot))
        .filter(f => fs.statSync(path.join(dataRoot, f)).isDirectory());
    let validEnvironmentStr = `Valid environments are ${validEnvironments.join(', ')}.`;
    
    let directory = process.argv[2];
    if (!directory) {
        let environmentStr = validEnvironments.join(', ');
        console.error("Error: Portfolio environment required. " + validEnvironmentStr);
        process.exit(0);
    }
    if (!directory.match(/[a-zA-Z0-9]+/)) {
        console.error("Error: Invalid format for directory");
        process.exit(0);
    }

    let rootPath = path.join(dataRoot, directory);
    let exists = await directoryExists(rootPath);
    if (!exists) {
        console.error(`Error: Portfolio directory ${directory} doesn't exist ` +
            `in portfolio_data. ${validEnvironmentStr}`);
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
