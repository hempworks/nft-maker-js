"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const actions_1 = require("../actions");
exports.command = 'run';
exports.desc = 'Run the generator';
const handler = (argv) => {
    (0, actions_1.generateManifest)();
    (0, actions_1.generateStats)();
    (0, actions_1.generateMetadata)();
    (0, actions_1.generateImages)();
    process.exit(0);
};
exports.handler = handler;
