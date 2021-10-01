"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("../util");
const fs_1 = __importDefault(require("fs"));
exports.command = 'stats';
exports.desc = 'Generate trait count statistics for the project';
const builder = yargs => yargs;
exports.builder = builder;
const handler = (argv) => {
    (0, util_1.info)(chalk_1.default.blue(`Generating NFT trait statistics...`));
    const config = (0, util_1.resolveConfiguration)();
    const manifest = (0, util_1.resolveManifest)();
    const { traits: t } = config;
    const categories = t;
    let counts = categories
        .map((cat) => {
        return {
            [cat.name]: cat.items
                .map((trait) => ({ [trait.name]: 0 }))
                .reduce((carry, trait) => {
                return {
                    ...carry,
                    ...trait,
                };
            }, {}),
        };
    })
        .reduce((carry, poop) => {
        return {
            ...carry,
            ...poop,
        };
    });
    manifest.forEach((item) => {
        Object.entries(item).forEach(v => {
            counts[v[0]][v[1]]++;
        });
    });
    fs_1.default.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
        flag: 'w',
    });
    (0, util_1.info)(chalk_1.default.green(`Finished generating NFT trait statistics.`));
    process.exit(0);
};
exports.handler = handler;
