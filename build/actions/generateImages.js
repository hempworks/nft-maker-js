"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
const util_2 = require("../util");
function createImage() {
    return (0, sharp_1.default)({
        create: {
            width: 2000,
            height: 2000,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 },
        },
    });
}
function compositeImage(image, item) {
    image.composite(Object.keys(item)
        .filter((key) => key !== 'tokenId')
        .map((key) => ({
        input: path_1.default.resolve(`./traits/${key}/${item[key]}.png`),
        gravity: 'center',
    })));
}
async function default_1(task) {
    const manifest = (0, util_1.resolveManifest)();
    for (const item of manifest) {
        const key = manifest.indexOf(item);
        const filePath = `./assets/${key}.png`;
        if (task) {
            task.output = `Creating image at '${filePath}'`;
        }
        const image = createImage();
        compositeImage(image, item);
        try {
            await image.toFile(filePath);
        }
        catch (err) {
            (0, util_2.fail)(`Failed to generate ${filePath}`);
        }
    }
}
exports.default = default_1;
