"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const actions_1 = require("../actions");
exports.command = 'stats';
exports.desc = 'Generate trait count statistics for the project';
const handler = (argv) => {
    (0, actions_1.generateStats)();
    process.exit(0);
};
exports.handler = handler;
