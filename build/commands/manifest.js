"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const lodash_1 = require("lodash");
const lib_1 = require("../lib");
const fs_1 = require("fs");
exports.command = 'manifest <amount>';
exports.desc = 'Generate an NFT configuration manifest';
const builder = yargs => yargs.positional('amount', { type: 'string', demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    const { amount } = argv;
    process.stdout.write(`Generating NFT manifest with ${amount} items...`);
    let { traits, editionSize } = require(`${__dirname}/../../project.config.js`);
    let imageData = (0, lodash_1.times)(editionSize, () => (0, lib_1.createNewUniqueImage)(traits));
    (0, fs_1.writeFile)('./manifest.json', JSON.stringify(imageData, null, 2), {
        flag: 'wx',
    }, err => {
        if (err)
            throw err;
        console.log('It already exists!');
    });
    process.exit(0);
};
exports.handler = handler;
