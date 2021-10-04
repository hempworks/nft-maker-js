"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const util_2 = require("../util");
function default_1() {
    (0, util_2.info)('Generating NFT images...');
    const manifest = (0, util_1.resolveManifest)();
    manifest.forEach((item, key) => {
        const image = (0, sharp_1.default)({
            create: {
                width: 2000,
                height: 2000,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            },
        });
        image.composite(Object.keys(item)
            .filter((key) => (0, util_1.shouldIncludeTrait)(key))
            .map((key) => ({
            input: path_1.default.resolve(`./traits/${key}/${item[key]}.png`),
            gravity: 'center',
        })));
        image
            .toFile(path_1.default.resolve(`./assets/${key}.png`))
            .then(() => {
            (0, util_2.info)(`Generated ${path_1.default.resolve(`./assets/${key}.png`)}`);
        })
            .catch(err => {
            (0, util_2.fail)(`Failed to generate ${path_1.default.resolve(`./assets/${key}.png`)}`);
        });
    });
    (0, util_2.info)('Finished generating NFT images!');
}
exports.default = default_1;
