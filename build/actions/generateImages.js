"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("../util");
function default_1() {
    const manifest = (0, util_1.resolveManifest)();
    manifest.map((item, key) => {
        let image = (0, sharp_1.default)({
            create: {
                width: 2000,
                height: 2000,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            },
        });
        Object.keys(item).forEach(key => {
            // console.log(shouldIncludeTrait(key))
            // if (shouldIncludeTrait(key)) {
            let imageName = `./traits/${key}.png`;
            image = image.composite([{ input: imageName, gravity: 'center' }]);
            // }
        });
        image.toFile(`./assets/${key}.png`, function (err) {
            console.log('error: ', err);
        });
    });
}
exports.default = default_1;
