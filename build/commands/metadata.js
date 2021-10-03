"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const actions_1 = require("../actions");
exports.command = 'metadata';
exports.desc = 'Generate the required metadata for the individual NFTs';
const handler = (argv) => {
    (0, actions_1.generateMetadata)();
    process.exit(0);
};
exports.handler = handler;
