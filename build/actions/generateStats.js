"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const fs_1 = __importDefault(require("fs"));
function default_1() {
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
        Object.entries(item).forEach(value => {
            if ((0, util_1.shouldIncludeTrait)(value[0])) {
                counts[value[0]][value[1]]++;
            }
        });
    });
    fs_1.default.writeFileSync('./stats.json', JSON.stringify(counts, null, 2), {
        flag: 'w',
    });
}
exports.default = default_1;
