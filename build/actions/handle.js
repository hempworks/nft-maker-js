"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("../util");
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = require("lodash");
const lib_1 = require("../lib");
function handle() {
    let configLocation = path_1.default.resolve('./project.config.js');
    if (!fs_1.default.existsSync(configLocation)) {
        (0, util_1.log)(chalk_1.default.red('There is no project.config.js in this folder.'));
        process.exit(1);
    }
    const { traits, editionSize } = require(configLocation);
    let imageData = (0, lodash_1.times)(editionSize, () => (0, lib_1.createNewUniqueImage)(traits));
    // Pull in the uniques...
    // Shuffle the deck a couple of times...
    // Assign token IDs...
    fs_1.default.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
        flag: 'w',
    });
}
exports.handle = handle;
