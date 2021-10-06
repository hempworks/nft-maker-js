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
let attempts = 0;
let combinations = 0;
function default_1() {
    const { traits, uniques, editionSize } = (0, util_1.resolveConfiguration)();
    prepareOutputFolder();
    uniques.forEach((u) => {
        if ((0, util_1.validUnique)(u)) {
            imageData.push(u);
        }
    });
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
function prepareOutputFolder() {
    let assetsDir = './assets';
    if (fs_1.default.existsSync(assetsDir)) {
        fs_1.default.rmdirSync(assetsDir, { recursive: true });
    }
}
function isCompatible(newImage) {
    const { traits } = (0, util_1.resolveConfiguration)();
    return Object.keys(newImage).reduce((carry, key) => {
        let trait = traits.filter((trait) => trait.name == key)[0];
        let traitOption = trait.items.filter(
        // @ts-ignore
        (item) => item.name === newImage[key])[0];
        if (!traitOption.hasOwnProperty('incompatible')) {
            return carry;
        }
        // Wew
        return Object.keys(traitOption.incompatible).reduce((innerCarry, incompatKey) => {
            let incompatValue = (0, lodash_1.castArray)(traitOption.incompatible[incompatKey]);
            // @ts-ignore
            if (incompatValue.includes(newImage[incompatKey])) {
                return false;
            }
            return innerCarry;
        }, carry);
    }, true);
}
function createNewUniqueImage(traits) {
    attempts++;
    if (attempts > 400) {
        throw Error(`Too many attempts ${attempts}`);
    }
    let newImage = createNewImage(traits);
    if (!imageData.includes(newImage) && isCompatible(newImage)) {
        combinations++;
        return newImage;
    }
    return createNewUniqueImage(traits);
}
function createNewImage(traits) {
    return (0, lodash_1.reduce)(traits, (carry, { name }) => {
        return {
            ...carry,
            ...{ [name]: (0, lib_1.getRandomWeightedTrait)(traits, name) },
        };
    }, {});
}
