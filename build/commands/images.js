"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const actions_1 = require("../actions");
exports.command = 'images';
exports.desc = 'Generate the image files for the NFTs';
const handler = (argv) => {
    (0, actions_1.generateImages)();
    process.exit(0);
};
exports.handler = handler;
