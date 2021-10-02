"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const generateStats_1 = __importDefault(require("../actions/generateStats"));
exports.command = 'stats';
exports.desc = 'Generate trait count statistics for the project';
const handler = (argv) => {
    (0, generateStats_1.default)();
    process.exit(0);
};
exports.handler = handler;
