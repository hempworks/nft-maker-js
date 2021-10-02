"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.desc = exports.command = void 0;
const generateManifest_1 = __importDefault(require("../actions/generateManifest"));
const generateStats_1 = __importDefault(require("../actions/generateStats"));
const generateMetadata_1 = __importDefault(require("../actions/generateMetadata"));
exports.command = 'run';
exports.desc = 'Run the generator';
const handler = (argv) => {
    (0, generateManifest_1.default)();
    (0, generateStats_1.default)();
    (0, generateMetadata_1.default)();
    process.exit(0);
};
exports.handler = handler;
