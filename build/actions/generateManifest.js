"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("../util");
const lodash_1 = require("lodash");
const lib_1 = require("../lib");
let imageData = [];
function default_1() {
    let assetsDir = './assets';
    if (fs_1.default.existsSync(assetsDir)) {
        fs_1.default.rmdirSync(assetsDir, { recursive: true });
    }
    const { traits, uniques, editionSize } = (0, util_1.resolveConfiguration)();
    uniques.forEach((u) => imageData.push(u));
    (0, lodash_1.times)(editionSize - uniques.length, () => imageData.push(createNewUniqueImage(traits)));
    imageData = (0, lodash_1.shuffle)(imageData);
    // Check compatibility
    // Assign token IDs...
    imageData = imageData.map((item, key) => {
        item['tokenId'] = key + 1;
        return item;
    });
    fs_1.default.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
        flag: 'w',
    });
}
exports.default = default_1;
function createNewUniqueImage(traits) {
    let attempts = 0;
    let newImage = createNewImage(traits);
    if (imageData.includes(newImage)) {
        attempts++;
        return createNewUniqueImage(traits);
    }
    attempts = 0;
    return newImage;
}
function createNewImage(traits) {
    return (0, lodash_1.reduce)(traits, (carry, { name }) => {
        return {
            ...carry,
            ...{ [name]: (0, lib_1.getRandomWeightedTrait)(traits, name) },
        };
    }, {});
}
