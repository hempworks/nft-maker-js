"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("../util");
const lodash_1 = require("lodash");
const lib_1 = require("../lib");
exports.command = 'manifest <amount>';
exports.desc = 'Generate an NFT configuration manifest';
const builder = yargs => yargs.positional('amount', { type: 'string', demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    const { amount } = argv;
    let configLocation = path_1.default.resolve('./project.config.js');
    if (!fs_1.default.existsSync(configLocation)) {
        (0, util_1.log)(chalk_1.default.red('There is no project.config.js in this folder.'));
        process.exit(1);
    }
    const { traits, editionSize } = require(configLocation);
    (0, util_1.log)(chalk_1.default.blue(`Generating NFT manifest with ${amount} items...`));
    let imageData = (0, lodash_1.times)(editionSize, () => (0, lib_1.createNewUniqueImage)(traits));
    fs_1.default.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
        flag: 'w',
    });
    (0, util_1.log)(chalk_1.default.green(`Finished generating NFT manifest.`));
    process.exit(0);
};
exports.handler = handler;
