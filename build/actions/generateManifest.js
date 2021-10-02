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
function handle() {
    (0, util_1.info)('Generating NFT manifest...');
    const { traits, editionSize } = (0, util_1.resolveConfiguration)();
    (0, lodash_1.times)(editionSize, () => {
        imageData.push(createNewUniqueImage(traits));
    });
    // Pull in the uniques...
    // Shuffle the deck a couple of times...
    // Check compatibility
    // Make sure it's unique
    // Assign token IDs...
    imageData = imageData.map((item, key) => {
        item['tokenId'] = key + 1;
        return item;
    });
    fs_1.default.writeFileSync('./manifest.json', JSON.stringify(imageData, null, 2), {
        flag: 'w',
    });
    (0, util_1.success)('Finished generating NFT manifest!');
}
exports.default = handle;
function createNewUniqueImage(traits) {
    let newImage = createNewImage(traits);
    if (imageData.includes(newImage)) {
        return createNewUniqueImage(traits);
    }
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
