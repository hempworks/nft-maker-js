"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const actions_1 = require("../actions");
exports.command = 'manifest';
exports.desc = 'Generate an NFT configuration manifest';
const handler = () => {
    (0, actions_1.generateManifest)();
    process.exit(0);
};
exports.handler = handler;
